import express from "express";
import * as recordingController from "../controller/recordingController.js";
const router = express.Router();

router.post("/start", recordingController.startRecording);

router.post("/stop", recordingController.stopRecording);

router.get("/info/:id", recordingController.getRecordingInfo);

router.get("/list/:classId", recordingController.listRecordings);

router.put(
  "/update-ai-summary/:recordingId",
  recordingController.updateAISummary
);
router.put("/publish/:recordingId", recordingController.publishRecording);

export default router;
