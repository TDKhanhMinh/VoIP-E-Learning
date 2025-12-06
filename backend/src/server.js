import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import connectDB from "./config/db.js";
import { initOnlineTestCron } from "./cron/updateOnlineTest.js";
import { submitTestSession } from "./cron/submitTestSession.js";
import authRoutes from "./router/authRouter.js";
import voipRoutes from "./router/voipRouter.js";
import userRoutes from "./router/userRouter.js";
import semesterRoutes from "./router/semesterRouter.js";
import courseRoutes from "./router/courseRouter.js";
import classRoutes from "./router/classRouter.js";
import classStudentRoutes from "./router/classStudentRouter.js";
import materialRoutes from "./router/materialRouter.js";
import assignmentRoutes from "./router/assignmentRouter.js";
import onlineTestRoutes from "./router/testOnlineRouter.js";
import testQuestionRoutes from "./router/testQuestionRouter.js";
import testSessionRoutes from "./router/testSessionRouter.js";
import testAttemptRoutes from "./router/testAttemptRouter.js";
import uploadQuesionsRouter from "./router/uploadQuestionRouter.js";
import submissionRoutes from "./router/submissionRouter.js";
import attendanceRoutes from "./router/attendanceRouter.js";
import announcementRoutes from "./router/announcementRouter.js";
import scheduleRoutes from "./router/scheduleRouter.js";
import roomRouters from "./router/roomRouter.js";
import driveRoutes from "./router/driveRouter.js";
import fileRoutes from "./router/fileRouter.js";
import postRoutes from "./router/postRouter.js";
import commentRoutes from "./router/commentRouter.js";
import topicRoutes from "./router/topicRouter.js";
import chatRoutes from "./router/chatRouter.js";
import recommendRoutes from "./router/recommendRouter.js";
import http from "http";
import bodyParser from "body-parser";
import livekitRouter from "./router/livekitRouter.js";
import recordingRoutes from "./router/recordingRouter.js";
import webHookRoutes from "./router/webHookRouter.js";
import { Server } from "socket.io";
import discussionSocket from "./sockets/discussionSocket.js";
import chatSocket from "./sockets/chatSocket.js";
await connectDB();
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://voip-e-learning-1.onrender.com",
  "https://meet.livekit.io",
  "http://localhost:5000",
];

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
app.use('/api/webhook', webHookRoutes);

app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/semester", semesterRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/class", classRoutes);
app.use("/api/class-student", classStudentRoutes);
app.use("/api/enrollment", classStudentRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/online-test", onlineTestRoutes);
app.use("/api/test-question", testQuestionRoutes);
app.use("/api/attempt", testAttemptRoutes);
app.use("/api/test-session", testSessionRoutes);
app.use("/api/upload-question", uploadQuesionsRouter);
app.use("/api/submission", submissionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/drive", driveRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/room", roomRouters);
app.use("/api/voip", voipRoutes);
app.use("/api/livekit", livekitRouter);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/topic", topicRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/recording', recordingRoutes);

initOnlineTestCron();
submitTestSession();
app.use(errorHandler);

const server = http.createServer(app);
const PORT = process.env.PORT;
export const io = new Server(server, {
  allowEIO4: true,
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const chatNsp = io.of("/chat");
chatSocket(chatNsp);
discussionSocket(io);
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
