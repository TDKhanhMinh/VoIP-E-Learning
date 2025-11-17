import mongoose from "mongoose";

const teachingScheduleSchema = new mongoose.Schema({
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: [
            "SCHEDULED",
            "COMPLETED",
            "ABSENT",
        ],
        default: "SCHEDULED",
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
});

const TeachingSchedule = mongoose.model("TeachingSchedule", teachingScheduleSchema);
export default TeachingSchedule;
