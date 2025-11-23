import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  credit: { type: Number, required: true, min: 1 },
  description: { type: String, default: null },
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
