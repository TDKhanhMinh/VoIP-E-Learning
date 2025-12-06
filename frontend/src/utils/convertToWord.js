import { asBlob } from "html-docx-js-typescript";

const convertImagesToBase64 = async (element) => {
  const images = element.querySelectorAll("img");

  const promises = Array.from(images).map(async (img) => {
    try {
      if (!img.src || img.src.startsWith("data:")) return;

      img.setAttribute("crossOrigin", "anonymous");

      const response = await fetch(img.src);
      const blob = await response.blob();

      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      img.src = base64;

      img.style.maxWidth = "100%";
      img.style.height = "auto";
    } catch (error) {
      console.error("Lỗi chuyển đổi ảnh sang Base64:", error);
      console.warn("Không thể chuyển đổi ảnh:", img.src);
    }
  });

  await Promise.all(promises);
};

export const convertHtmlToWord = async (htmlContent, fileName) => {
  try {
    const container = document.createElement("div");
    container.innerHTML = htmlContent;

    await convertImagesToBase64(container);

    const cssStyle = `
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; }
        h1, h2, h3 { color: #2E75B6; margin-top: 20px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        td, th { border: 1px solid #000; padding: 8px; }
        img { max-width: 600px; }
      </style>
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          ${cssStyle}
      </head>
      <body>
          ${container.innerHTML}
      </body>
      </html>
    `;

    const blob = await asBlob(fullHtml);
    const mimeType =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const finalName = fileName.endsWith(".docx")
      ? fileName
      : `${fileName}.docx`;

    const file = new File([blob], finalName, {
      type: mimeType,
      lastModified: Date.now(),
    });

    return file;
  } catch (error) {
    console.error("Lỗi tạo Blob Word:", error);
    throw error;
  }
};
