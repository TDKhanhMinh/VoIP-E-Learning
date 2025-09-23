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
  score: { type: Float16Array, default: 0 },
  feedback: { type: String, default: null },
});

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
