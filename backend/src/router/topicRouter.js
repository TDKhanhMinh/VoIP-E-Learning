import * as controller from "../controller/topicController.js";
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const router = express.Router();
router.get("/", controller.getAllTopics);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  controller.createTopic
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  controller.updateTopic
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  controller.deleteTopic
);
export default router;
