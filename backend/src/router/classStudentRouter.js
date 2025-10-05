import express from "express";
import * as controller from "../controller/classStudentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import { createClassStudentSchema } from "../validation/classStudent.validation.js";

const router = express.Router();

router.get("/:class_id", controller.getClassStudents);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  validate(createClassStudentSchema),
  controller.createClassStudent
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  controller.deleteClassStudent
);

export default router;
