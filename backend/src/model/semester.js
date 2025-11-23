import mongoose from "mongoose";

const semesterSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    start_date: { type: Date },
    end_date: { type: Date },
    mid_term: {
      start_date: Date,
      end_date: Date,
    },
  },
  { timestamps: true }
);

const Semester = mongoose.model("Semester", semesterSchema);
export default Semester;
