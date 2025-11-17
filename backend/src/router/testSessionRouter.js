import * as controller from "../controller/testSessionController.js";
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();
router.get(
  "/test/:testId",
  protect,
  controller.getTestSessionsByTestAndStudent
);
router.get("/:id", controller.getTestSessionById);
router.post("", controller.createTestSession);
router.patch("/:id", controller.updateTestSession);
router.delete("/:id", controller.deleteTestSession);
router.get(
  "/test/:testId",
  protect,
  controller.getTestSessionsByTestAndStudent
);

export default router;
