import mongoose from "mongoose";

const classStudentSchema = mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joined_at: { type: Date, require: true },
});

const ClassStudent = mongoose.model("ClassStudent", classStudentSchema);
export default ClassStudent;
