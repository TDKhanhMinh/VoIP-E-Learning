import express from "express";
import * as postController from "../controller/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/forum/:topic_id", protect, postController.createPostForTopic);
router.get("/forum", postController.getForumPosts);
router.get("/forum/:id", postController.getPostById);
router.patch("/forum/:id/approve", protect, postController.approvePost);
router.patch("/forum/:id/reject", protect, postController.rejectPost);
router.put("/forum/:id", protect, postController.updatePost);
router.delete("/forum/:id", protect, postController.deletePost);
router.post("/:class_id", protect, postController.createPost);
router.get("/:class_id", postController.getPosts);
router.put("/:id", protect, postController.updatePost);

export default router;
