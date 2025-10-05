import express from "express";
import * as controller from "../controller/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validation/user.validation.js";

const router = express.Router();

router.get("/", controller.getAllUser);
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validate(createUserSchema),
  controller.createUser
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validate(updateUserSchema),
  controller.updateUser
);

router.delete("/:id", protect, authorizeRoles("admin"), controller.deleteUser);

export default router;
