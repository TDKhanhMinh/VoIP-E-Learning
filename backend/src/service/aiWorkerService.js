import { Worker } from "bullmq";
import { processMeetingData } from "./aiService.js";
import RecordLessonSummary from "./../model/recordLessonSummary.js";
import connectDB from "../config/db.js";
import * as emailService from "../service/emailService.js";
import * as userService from "../service/userService.js";
import { createSummaryReadyHtml } from "../utils/emailTemplete.js";
import { formatVietnameseDate } from "../utils/formatVietnameseDate.js";

await connectDB();
const worker = new Worker(
  "transcribeAndSummarize",
  async (job) => {
    const { roomName, recordingUrl, egressId } = job.data;
    console.log(`[Worker] Processing Job ID: ${job.id} - Room: ${roomName}`);
    const result = await processMeetingData(recordingUrl, roomName);
    console.log(`[Worker] Done Job ID: ${job.id}`);
    console.log(`[Worker] Room: ${roomName}`);
    console.log(`[Worker] Egress ID: ${egressId}`);
    console.log(`[Worker] Result: ${JSON.stringify(result)}`);
    await RecordLessonSummary.findOneAndUpdate(
      { egressId: egressId },
      {
        aiTranscript: result.transcript,
        aiSummary: result.summary,
        summaryTitle: result.summaryTitle,
        aiStatus: "COMPLETED",
        recordingUrl: recordingUrl,
      }
    );
    const completeRecord = await RecordLessonSummary.findOne(
      { egressId: egressId },
      { updatedAt: 1, teacherId: 1 }
    );
    console.log("[Worker] Record save", completeRecord);

    const teacher = await userService.findById(completeRecord.teacherId.toString());
    console.log("[Worker] Teacher found", teacher.email);
    const completionTime = completeRecord.updatedAt;

    const htmlData = {

      lecturerName: teacher.full_name,
      className: roomName,
      completionTime: formatVietnameseDate(completionTime),
    };
    const htmlContent = createSummaryReadyHtml(htmlData);
    const subject = `[THÔNG BÁO] Tóm tắt buổi học môn ${roomName} đã hoàn thành`;
    const content = ``;

    await emailService.sendEmail(
      teacher.email,
      subject,
      htmlContent,
      "Hệ thống LMS",
      content
    );
    console.log("[Worker] Email sent to", teacher.email);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "redis",
      port: 6379,
    },
    concurrency: 5,
  }
);

worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job.id} thất bại:`, err.message);
});

console.log("AI Worker đã khởi động và đang lắng nghe Job...");
