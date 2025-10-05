import express from "express";
import * as controller from "../controller/courseController.js";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validation/course.validation.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getCourseById);
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validate(createCourseSchema),
  controller.createCourse
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validate(updateCourseSchema),
  controller.updateCourse
);
router.delete("/:id", controller.deleteCourse);

export default router;
