import cron from "node-cron";
import OnlineTest from "../model/online_test.js";

export const initOnlineTestCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const result = await OnlineTest.updateMany(
        { end: { $lt: now }, available: true },
        { $set: { available: false } }
      );

      if (result.modifiedCount > 0) {
        console.log(
          `[CRON] Updated ${result.modifiedCount} tests to available=false`
        );
      }
    } catch (err) {
      console.error("[CRON ERROR] Failed to update online tests:", err);
    }
  });

  console.log("[CRON] Online test auto-updater started");
};
