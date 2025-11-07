import express from "express";
import * as commentController from "../controller/commentController.js"
const router = express.Router();

router.post("/:post_id", commentController.createComment);
router.get("/:post_id", commentController.getComments);

export default router;
