import mongoose from "mongoose";

const testSessionSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "OnlineTest" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  startedAt: Date,
  remainingTime: Number,

  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      question: String,
      image: String,
      options: [
        {
          optionId: mongoose.Schema.Types.ObjectId,
          answer: String,
        },
      ],

      selectedOptionId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
  ],

  finished: { type: Boolean, default: false },
});

const TestSession = mongoose.model("TestSession", testSessionSchema);
export default TestSession;
