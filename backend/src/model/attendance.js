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
    enum: ["Present", "Absent", "Late"],
    default: "Absent",
  },
  attend_at: { type: Date, default: null },
  attend_date: { type: Date, default: null },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
