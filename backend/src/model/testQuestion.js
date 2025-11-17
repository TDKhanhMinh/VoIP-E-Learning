import mongoose from "mongoose";

const testQuestionSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineTest",
    required: true,
  },
  question: { type: String, required: true },
  options: [
    {
      answer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  image: { type: String, default: null },
});

const TestQuestion = mongoose.model("TestQuestion", testQuestionSchema);
export default TestQuestion;
