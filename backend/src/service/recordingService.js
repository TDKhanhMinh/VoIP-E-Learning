import RecordLessonSummary from "./../model/recordLessonSummary.js";
import {
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
  S3Upload,
} from "livekit-server-sdk";

const egressClient = new EgressClient(
  process.env.LIVEKIT_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export const startClassRecording = async (roomName, classId) => {
  const fileOutput = new EncodedFileOutput({
    fileType: EncodedFileType.MP4,
    filepath: `recordings/${classId}/${Date.now()}.mp4`,
    output: {
      case: "s3",
      value: new S3Upload({
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET_NAME,
      }),
    },
  });
  console.log("=== DEBUG OUTPUT DATA ===");
  console.log(JSON.stringify(fileOutput, null, 2));
  try {
    const info = await egressClient.startRoomCompositeEgress(
      roomName,
      {
        file: fileOutput,
      },
      {
        audioOnly: true,
      }
    );

    console.log(
      `[EgressService] Started recording for room ${roomName}. EgressID: ${info.egressId}`
    );
    return info;
  } catch (error) {
    console.error("[EgressService] Error starting recording:", error);
    throw error;
  }
};
export const stopClassRecording = async (egressId) => {
  try {
    await egressClient.stopEgress(egressId);
    console.log(`[EgressService] Stopped recording. EgressID: ${egressId}`);
  } catch (error) {
    console.error("[EgressService] Error stopping recording:", error);
    throw error;
  }
};
export const getRecordingInfo = async (id) => {
  try {
    const info = await RecordLessonSummary.findOne({ _id: id });
    return info;
  } catch (error) {
    console.error("Error getting recording info:", error);
    throw error;
  }
};
export const listRecordings = async (classId) => {
  try {
    const recordings = await RecordLessonSummary.find({ classId: classId });
    return recordings;
  } catch (error) {
    console.error("[EgressService] Error listing recordings:", error);
    throw error;
  }
};
export const updateAISummary = async (recordingId, aiSummary) => {
  try {
    const recording = await RecordLessonSummary.findById(recordingId);
    if (!recording) {
      throw new Error("Recording not found");
    }
    recording.aiSummary = aiSummary;
    recording.isReviewed = true;
    recording.isPublished = false;
    await recording.save();
    return recording;
  } catch (error) {
    console.error("Error updating AI summary:", error);
    throw error;
  }
};
export const publishRecording = async (recordingId) => {
  try {
    const recording = await RecordLessonSummary.findById(recordingId);
    if (!recording) {
      throw new Error("Recording not found");
    }
    recording.isPublished = true;
    await recording.save();
    return recording;
  } catch (error) {
    console.error("Error publishing recording:", error);
    throw error;
  }
};
