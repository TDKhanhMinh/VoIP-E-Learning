process.on('uncaughtException', (err, origin) => {
  console.error(`LỖI UNCAUGHT EXCEPTION: ${err.message}`, `Origin: ${origin}`);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('LỖI UNHANDLED REJECTION:', reason);
});

import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import connectDB from "./config/db.js";

import authRoutes from "./router/authRouter.js";
import voipRoutes from "./router/voipRouter.js";
import userRoutes from "./router/userRouter.js";
import semesterRoutes from "./router/semesterRouter.js";
import courseRoutes from "./router/courseRouter.js";
import classRoutes from "./router/classRouter.js";
import classStudentRoutes from "./router/classStudentRouter.js";
import materialRoutes from "./router/materialRouter.js";
import assignmentRoutes from "./router/assignmentRouter.js";
import submissionRoutes from "./router/submissionRouter.js";
import attendanceRoutes from "./router/attendanceRouter.js";
import announcementRoutes from "./router/announcementRouter.js";
import teachingScheduleRoutes from "./router/teachingScheduleRouter.js";
import roomRouters from "./router/roomRouter.js";
import driveRoutes from "./router/driveRouter.js";
import fileRoutes from "./router/fileRouter.js";
import http from "http";
import livekitRouter from "./router/livekitRouter.js";
await connectDB();
const app = express();
const allowedOrigins = ["http://localhost:5173", "https://voip-e-learning-1.onrender.com", "https://meet.livekit.io"];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/semester", semesterRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/class", classRoutes);
app.use("/api/enrollment", classStudentRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/drive", driveRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/schedule", teachingScheduleRoutes);
app.use("/api/room", roomRouters);
app.use("/api/voip", voipRoutes);
app.use("/api/livekit", livekitRouter);

app.use(errorHandler);


const server = http.createServer(app);
const PORT = process.env.PORT;
server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// connectARI();
// app.listen(PORT, async () => {
//   console.log(`Server running on port ${PORT}`);
// });
