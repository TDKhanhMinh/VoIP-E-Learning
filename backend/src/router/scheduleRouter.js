import express from "express";
import * as controller from "../controller/scheduleController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:semester_id", protect, controller.getScheduleBySemester);
export default router;
