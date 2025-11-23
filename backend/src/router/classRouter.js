import express from "express";
import * as controller from "../controller/classController.js";
import {
  createClassSchema,
  updateClassSchema,
} from "../validation/class.validation.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.findById);
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validate(createClassSchema),
  controller.createClass
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validate(updateClassSchema),
  controller.updateClass
);
router.delete("/:id", protect, authorizeRoles("admin"), controller.deleteClass);

router.post(
  "/:classId/absence",
  protect,
  authorizeRoles("admin", "teacher"),
  controller.addAbsenceDate
);

export default router;
