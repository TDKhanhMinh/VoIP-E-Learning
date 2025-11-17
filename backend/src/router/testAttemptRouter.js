import * as controller from "../controller/testAttemptController.js";
import { protect } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/", controller.getAllTestAttempts);

router.get("/id/:id", controller.getAttemptById);

router.get("/test/:onlineTestId", controller.getAttemptsByTest);

router.get("/student/:studentId", controller.getAttemptsByStudent);

router.get(
  "/student-attempts/:testId",
  protect,
  controller.getAttemptsByStudentAndTest
);

router.post("/:sessionId", protect, controller.createTestAttempt);

export default router;
