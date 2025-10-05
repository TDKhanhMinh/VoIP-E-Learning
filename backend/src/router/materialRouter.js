import express from "express";
import * as controller from "../controller/materialController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import { createMaterialSchema } from "../validation/material.validation.js";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:class_id", controller.getClassMaterial);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  validate(createMaterialSchema),
  controller.createMaterial
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  controller.deleteMaterial
);

export default router;
