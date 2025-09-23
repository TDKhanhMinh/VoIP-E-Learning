import mongoose from "mongoose";

const semesterSchema = mongoose.Schema({
  name: { type: String, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
});

const Semester = mongoose.model("Semester", semesterSchema);
export default Semester;
