import fs from "fs-extra";
import path from "path";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const downloadFile = async (url, outputPath) => {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateContentWithRetry = async (model, parts, retries = 5) => {
  try {
    return await model.generateContent(parts);
  } catch (error) {
    if (
      (error.response?.status === 429 || error.status === 429) &&
      retries > 0
    ) {
      const waitTime = 60000;
      console.warn(
        `[AI Service] Quota exceeded (429). Đang đợi ${
          waitTime / 1000
        }s để thử lại... (Còn ${retries} lần)`
      );

      await sleep(waitTime);

      return generateContentWithRetry(model, parts, retries - 1);
    }
    throw error;
  }
};
export const processMeetingData = async (fileUrl, roomName) => {
  const tempFilePath = path.join("/tmp", `${roomName}-${Date.now()}.mp4`);

  try {
    console.log(`[AI Service] Đang tải file về: ${tempFilePath}`);
    await downloadFile(fileUrl, tempFilePath);

    const fileBuffer = await fs.readFile(tempFilePath);
    const base64Data = fileBuffer.toString("base64");

    console.log(
      `[AI Service] Đã đọc file (${fileBuffer.length} bytes). Đang gọi Gemini...`
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
  Đóng vai trò là một Trợ giảng Đại học chuyên nghiệp (Academic Teaching Assistant). Nhiệm vụ của bạn là xử lý file ghi âm bài giảng đính kèm và trích xuất thông tin quan trọng.

  Hãy thực hiện 3 nhiệm vụ sau đây thật chính xác:

  1. **Nhiệm vụ "transcript" (Chép lời):**
     - Chuyển đổi toàn bộ âm thanh thành văn bản tiếng Việt.
     - Cố gắng phân biệt người nói (Ví dụ: "Giáo viên:", "Sinh viên:").
     - Loại bỏ các từ thừa, ậm ừ (như "à", "ừm", "kiểu là") để văn bản trôi chảy nhưng vẫn giữ nguyên ý nghĩa.
     - Giữ nguyên các thuật ngữ chuyên ngành (Tiếng Anh hoặc Tiếng Việt).
  2. **Nhiệm vụ "summaryTitle" (Tạo tiêu đề):**
     - Dựa trên nội dung bài giảng, hãy TỰ ĐẶT một tiêu đề ngắn gọn, súc tích (dưới 15 từ).
     - Tiêu đề phải khái quát được chủ đề chính của buổi học.
  3. **Nhiệm vụ "summary" (Tóm tắt thông minh):**
     - Đừng viết một đoạn văn dài. Hãy sử dụng định dạng **Markdown** để trình bày.
     - Cấu trúc tóm tắt bắt buộc phải có các phần:
       - **Chủ đề chính:** Nội dung bao quát của buổi học.
       - **Các điểm kiến thức cốt lõi:** Các định nghĩa, công thức, hoặc quy trình quan trọng (gạch đầu dòng).
       - **Ví dụ thực tế:** (Nếu có trong bài giảng).
       - **Lưu ý quan trọng:** Những điều giáo viên nhấn mạnh hoặc cảnh báo hay sai.
       - **Bài tập & Deadline:** Liệt kê chi tiết bài tập về nhà và thời hạn nộp (nếu được nhắc đến).

  **YÊU CẦU ĐẦU RA (OUTPUT FORMAT):**
  - Trả về kết quả dưới dạng **JSON thuần** (Raw JSON Object).
  - Không được bọc JSON trong Markdown code block (như \`\`\`json ... \`\`\`).
  - Đảm bảo các ký tự đặc biệt trong chuỗi JSON được escape đúng quy chuẩn.
  - Cấu trúc JSON phải bao gồm trường "transcript", "summaryTitle" và "summary".
  -Cấu trúc JSON bắt buộc:
  {
    "transcript": "Giáo viên: Chào các em... \\nSinh viên: Thưa thầy...",
    "summaryTitle": "Tiêu đề do bạn tự đặt dựa trên nội dung bài giảng",
    "summary": "### Chủ đề chính\\n... \\n### Bài tập\\n- Bài 1 trang 50..."
  }
`;

    const result =
      // await generateContentWithRetry(model, [
      //   {
      //     inlineData: {
      //       mimeType: "audio/mp4",
      //       data: base64Data,
      //     },
      //   },
      //   { text: prompt },
      // ]);
      await model.generateContent([
        {
          inlineData: {
            mimeType: "audio/mp4",
            data: base64Data,
          },
        },
        { text: prompt },
      ]);

    console.log("[AI Service] Gemini đã trả về kết quả.");

    const jsonResponse = JSON.parse(result.response.text());

    await fs.unlink(tempFilePath);

    return {
      transcript: jsonResponse.transcript,
      summary: jsonResponse.summary,
      summaryTitle: jsonResponse.summaryTitle,
    };
  } catch (error) {
    if (await fs.pathExists(tempFilePath)) await fs.unlink(tempFilePath);
    console.error("[AI Service Error]", error);
    throw error;
  }
};
