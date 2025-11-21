// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// const participantSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     email: { type: String },
//     name: { type: String },
//     joinedAt: { type: Date, default: Date.now },
//     leftAt: { type: Date },
// });

// const roomSchema = new mongoose.Schema(
//     {
//         _id: {
//             type: String,
//             default: () => uuidv4().replace(/-/g, "").slice(0, 16),
//         },
//         courseId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Course",
//             required: true,
//         },
//         teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         teacherEmail: { type: String },
//         teacherName: { type: String },
//         bridgeId: { type: String },
//         createdAt: { type: Date, default: Date.now },
//         startedAt: { type: Date },
//         endedAt: { type: Date },
//         participants: [participantSchema],
//         status: {
//             type: String,
//             enum: ["active", "ended"],
//             default: "active",
//         },
//         metadata: { type: Object },
//     },
//     { timestamps: true }
// );

// export default mongoose.model("Room", roomSchema);
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: String,
  name: String,
  role: { type: String, enum: ["teacher", "student"], default: "student" },
  joinedAt: { type: Date, default: Date.now },
  leftAt: { type: Date },
  duration: Number,
});

const roomSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teacherEmail: String,
    teacherName: String,

    roomName: { type: String, unique: true },
    joinCode: { type: String, unique: true },

    createdAt: { type: Date, default: Date.now },
    startedAt: Date,
    endedAt: Date,
    status: { type: String, enum: ["active", "ended"], default: "active" },
    participants: [participantSchema],
    metadata: Object,
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
