import express from "express";
import * as controller from "../controller/semesterController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import {
  createSemesterSchema,
  updateSemesterSchema,
} from "../validation/semester.validation.js";

const router = express.Router();

router.get("/", controller.getAll);
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validate(createSemesterSchema),
  controller.createSemester
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validate(updateSemesterSchema),
  controller.updateSemester
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  controller.deleteSemester
);

export default router;
