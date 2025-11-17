import cron from "node-cron";
import { autoSubmitExpiredSessions } from "../service/testSessionService.js";

export const submitTestSession = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await autoSubmitExpiredSessions();
    } catch (err) {
      console.error("Error running auto-submit cron:", err);
    }
  });
};
