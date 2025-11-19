import express from "express";
import * as postController from "../controller/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/forum/:topic_id", protect, postController.createPostForTopic);
router.get("/forum", postController.getForumPosts);
router.post("/:class_id", protect, postController.createPost);
router.get("/:class_id", postController.getPosts);
router.put("/:id", protect, postController.updatePost);
router.delete("/forum/:id", protect, postController.deletePost);

export default router;
