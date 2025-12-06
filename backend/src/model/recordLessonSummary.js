import mongoose from "mongoose";

const recordLessonSummarySchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      index: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },

    egressId: { type: String, unique: true, index: true },
    recordingUrl: { type: String },

    summaryTitle: { type: String, default: "" },
    aiTranscript: { type: String, default: "" },
    aiSummary: { type: String, default: "" },

    aiStatus: {
      type: String,
      enum: ["IDLE", "PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "IDLE",
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    aiError: { type: String },
  },
  {
    timestamps: true,
  }
);

const RecordLessonSummary = mongoose.model(
  "RecordLessonSummary",
  recordLessonSummarySchema
);

export default RecordLessonSummary;
