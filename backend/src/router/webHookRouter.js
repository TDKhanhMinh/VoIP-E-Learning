import express from "express";
import * as recordingController from "../controller/recordingController.js";
const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/webhook+json" }),
  recordingController.handleWebhook
);

export default router;
