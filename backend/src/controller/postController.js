import * as PostService from "../service/postService.js";
import { io } from "../server.js";

export const createPost = async (req, res) => {
  const payload = {
    ...req.body,
    class_id: req.params.class_id,
  };
  const post = await PostService.createPost(payload);
  io.to(req.params.class_id).emit("new_post", post);
  res.json(post);
};

export const createPostForTopic = async (req, res) => {
  const author_id = req.user._id;
  const payload = {
    ...req.body,
    author_id,
    topic_id: req.params.topic_id,
    status: "pending",
  };
  const post = await PostService.createPost(payload);
  io.to(req.params.topic_id).emit("new_post", post);
  res.json(post);
};

export const getPosts = async (req, res) => {
  const posts = await PostService.getPostsByClass(req.params.class_id);
  res.json(posts);
};

export const getForumPosts = async (req, res) => {
  const posts = await PostService.getForumPosts();
  res.json(posts);
};

export const updatePost = async (req, res) => {
  const post = await PostService.updatePost(req.params.id, req.body);
  res.json(post);
};

export const deletePost = async (req, res) => {
  await PostService.deletePost(req.params.id);
  res.json({ message: "Post deleted successfully" });
};
