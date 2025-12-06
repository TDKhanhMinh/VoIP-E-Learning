import { WebhookReceiver } from "livekit-server-sdk";
import * as egressService from "../service/recordingService.js";
import * as jobQueueService from "../service/jobQueueService.js";
import * as userService from "../service/userService.js";
import { generatePresignedUrl } from "./../utils/s3Utils.js";
import RecordLessonSummary from "./../model/recordLessonSummary.js";

export const startRecording = async (req, res) => {
  try {
    const { roomName, classId, teacherId } = req.body;

    if (!roomName || !classId || !teacherId) {
      return res
        .status(400)
        .json({ error: "Thiếu roomName hoặc classId hoặc teacherId  " });
    }
    const teacher = await userService.findById(teacherId.toString());
    const result = await egressService.startClassRecording(roomName, classId);
    await RecordLessonSummary.create({
      egressId: result.egressId,
      classId: classId,
      teacherId: teacherId,
      createdBy: teacher.full_name,
      roomName: roomName,
      aiStatus: "IDLE",
    });
    return res.status(200).json({
      message: "Recording started successfully",
      egressId: result.egressId,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const webhookReceiver = new WebhookReceiver(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );
    const authHeader = req.get("Authorization");
    console.log(`Request Body: '${req.body.toString()}'`);
    const event = await webhookReceiver.receive(
      req.body.toString(),
      authHeader
    );
    console.log("Event received:", event.event);
    if (event.event === "egress_ended") {
      const egressInfo = event.egressInfo;
      const roomName = egressInfo.roomName;
      console.log(`[Egress] Egress ended for room: ${roomName}`);
      console.log(`[Egress] Egress info: ${JSON.stringify(egressInfo)}`);
      console.log(`[Egress] Egress status: ${egressInfo.status}`);
      if (egressInfo.status === 3 || egressInfo.status === "EGRESS_COMPLETE") {
        const fileResult = egressInfo.fileResults[0];
        console.log("File result:", fileResult);
        const s3Key = fileResult.filename;
        console.log(
          `[Egress] Recording succeeded for room ${roomName}. S3 Key: ${s3Key}`
        );
        const presignedUrl = await generatePresignedUrl(s3Key);
        console.log("[Egress] Generated presigned URL.", presignedUrl);
        console.log(`[Egress] File available. Key: ${s3Key}`);
        console.log(`[Egress] Presigned URL: ${presignedUrl}`);
        await RecordLessonSummary.findOneAndUpdate(
          { egressId: egressInfo.egressId },
          {
            s3Key: s3Key,
            recordingUrl: presignedUrl,
            aiStatus: "PENDING",
          }
        );
        await jobQueueService.transcriptionQueue.add("transcribeRecording", {
          roomName: roomName,
          recordingUrl: presignedUrl,
          egressId: egressInfo.egressId,
          s3Key: s3Key,
        });

        console.log("[Egress] Job added to transcription queue.");
      } else {
        console.warn(
          `[Egress] Recording failed for room ${roomName}: ${egressInfo.error}`
        );
        await RecordLessonSummary.findOneAndUpdate(
          { roomName: roomName },
          {
            aiStatus: "FAILED",
            aiError: egressInfo.error,
          }
        );
      }
    }

    return res.status(200).send("Webhook received successfully");
  } catch (error) {
    console.error("[Webhook] Error validation:", error);
    return res.status(401).send("Invalid Webhook Signature or Server Error");
  }
};
export const stopRecording = async (req, res) => {
  try {
    const { egressId } = req.body;
    await egressService.stopClassRecording(egressId);
    return res.status(200).json({ message: "Recording stopped successfully" });
  } catch (error) {
    console.error("Error stopping recording:", error);
    throw error;
  }
};

export const getRecordingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const info = await egressService.getRecordingInfo(id);
    return res.status(200).json(info);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const listRecordings = async (req, res) => {
  try {
    const { classId } = req.params;
    const recordings = await egressService.listRecordings(classId);
    return res.status(200).json(recordings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const updateAISummary = async (req, res) => {
  try {
    const { recordingId } = req.params;
    const { aiSummary } = req.body;
    const updatedRecording = await egressService.updateAISummary(
      recordingId,
      aiSummary
    );
    return res.status(200).json(updatedRecording);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const publishRecording = async (req, res) => {
  try {
    const { recordingId } = req.params;
    const publishedRecording = await egressService.publishRecording(
      recordingId
    );
    return res.status(200).json(publishedRecording);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
