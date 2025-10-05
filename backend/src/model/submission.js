import mongoose from "mongoose";

const submissionSchema = mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  file_url: { type: String, required: true },
  score: { type: Number, default: 0, min: 0, max: 10 },
  feedback: { type: String, default: null },
  graded: { type: Boolean, default: false },
});

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
