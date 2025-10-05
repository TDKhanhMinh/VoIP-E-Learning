import express from "express";
import * as controller from "../controller/attendanceController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import {
  createAttendanceSchema,
  updateAttendanceSchema,
} from "../validation/attendance.validation.js";

const router = express.Router();

router.get("/", controller.getAll);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  validate(createAttendanceSchema),
  controller.createAttendance
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  validate(updateAttendanceSchema),
  controller.updateAttendance
);
router.delete("/:id", controller.deleteAttendance);

export default router;
