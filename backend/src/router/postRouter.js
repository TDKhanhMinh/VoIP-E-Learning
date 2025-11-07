import express from "express";
import * as postController from "../controller/postController.js"
const router = express.Router();

router.post("/:class_id", postController.createPost);
router.get("/:class_id", postController.getPosts);

export default router;
