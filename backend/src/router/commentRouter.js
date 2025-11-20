import express from "express";
import * as commentController from "../controller/commentController.js";
const router = express.Router();

router.post("/:post_id", commentController.createComment);
router.get("/:post_id", commentController.getComments);
router.delete("/:comment_id", commentController.deleteComment);
router.put("/:comment_id", commentController.updateComment);

export default router;
