import { Queue } from "bullmq";

const connection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      host: process.env.REDIS_HOST || "localhost",
      port: 6379,
    };

export const transcriptionQueue = new Queue("transcribeAndSummarize", {
  connection,
});
