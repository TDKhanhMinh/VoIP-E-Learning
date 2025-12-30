import mongoose from "mongoose";

const onlineTestSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },

    available: { type: Boolean, default: true },

    start: { type: Date, required: true },

    end: { type: Date, required: true },

    time: { type: String, required: true },

    attempts: { type: Number, required: true },

    description: { type: String },

    shuffle: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    totalQuestions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const OnlineTest = mongoose.model("OnlineTest", onlineTestSchema);
export default OnlineTest;
