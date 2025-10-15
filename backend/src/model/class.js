import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    enum: [2, 3, 4, 5, 6, 7],
  },
  shift: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4],
  },

}, { _id: false });

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },

  schedule: {
    type: [scheduleSchema],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0 && arr.length <= 2;
      },
      message: "Lịch học phải có từ 1 đến 2 buổi mỗi tuần.",
    },
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Class = mongoose.model("Class", classSchema);
export default Class;
