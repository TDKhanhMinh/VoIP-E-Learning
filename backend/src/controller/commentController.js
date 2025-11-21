import * as CommentService from "../service/commentService.js";
import { io } from "../server.js";

export const createComment = async (req, res) => {
  const payload = {
    ...req.body,
    post_id: req.params.post_id,
  };
  const comment = await CommentService.createComment(payload);

  io.to(req.params.post_id).emit("new_comment", comment);
  res.json(comment);
};

export const getComments = async (req, res) => {
  const { comments, hasMore } = await CommentService.getCommentsByPost(
    req.params.post_id,
    req.query
  );
  res.json({ comments, hasMore });
};

export const deleteComment = async (req, res) => {
  await CommentService.deleteComment(req.params.comment_id);
  res.json({ message: "Comment deleted successfully" });
};

export const updateComment = async (req, res) => {
  const comment = await CommentService.updateComment(
    req.params.comment_id,
    req.body
  );
  res.json(comment);
};
