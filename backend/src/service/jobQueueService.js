import { Queue } from "bullmq";

export const transcriptionQueue = new Queue("transcribeAndSummarize", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
  },
});
