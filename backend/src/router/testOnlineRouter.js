import * as controller from "../controller/onlineTestController.js";
import express from "express";
import { validate } from "../middlewares/validate.js";
import { onlineTestSchema } from "../validation/onlineTest.validation.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const router = express.Router();
router.get("/", controller.getAllOnlineTests);
router.get("/student", protect, controller.getStudentOnlineTests);
router.get("/class/:classId", controller.getClassOnlineTests);
router.get("/:id", controller.getOnlineTestById);
router.post(
  "/",
  protect,
  authorizeRoles("teacher"),
  validate(onlineTestSchema),
  controller.createOnlineTest
);
router.put(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  controller.updateOnlineTest
);
router.put(
  "/:id/questions",
  protect,
  authorizeRoles("teacher"),
  controller.updateOnlineTestQuestions
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  controller.deleteOnlineTest
);
export default router;
