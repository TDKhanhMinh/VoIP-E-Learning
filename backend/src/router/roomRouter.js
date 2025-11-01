import express from "express";
import { startSession, joinRoom, endRoom } from "../controller/roomController.js";

const router = express.Router();

// Tạo buổi học mới (chỉ giáo viên)
router.post("/class/:id/startSession", startSession);

// Học viên tham gia buổi học
router.post("/:id/join", joinRoom);

// Kết thúc buổi học
router.delete("/:id/end", endRoom);

export default router;
