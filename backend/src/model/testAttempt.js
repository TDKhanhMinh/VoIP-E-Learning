import mongoose from "mongoose";

const testAttemptSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    onlineTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnlineTest",
      required: true,
    },
    score: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    submitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

export default TestAttempt;
