import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent", "late"],
    default: "present",
  },
  lesson: { type: Number, required: true, default: 1 },
  attend_at: { type: Date, default: null },
});
attendanceSchema.index({ class: 1, student: 1, lesson: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;

