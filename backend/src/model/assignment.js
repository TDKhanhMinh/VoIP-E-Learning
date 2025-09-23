import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    due_at: { type: Date },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
