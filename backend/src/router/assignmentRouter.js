import express from "express";
import * as controller from "../controller/assignmentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "../validation/assignment.validation.js";

const router = express.Router();

router.get("/", controller.getAll);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  validate(createAssignmentSchema),
  controller.createAssignment
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  validate(updateAssignmentSchema),
  controller.updateAssignment
);
router.delete("/:id", controller.deleteAssignment);

export default router;
