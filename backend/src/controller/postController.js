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

export const getPostById = async (req, res) => {
  try {
    const post = await PostService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approvePost = async (req, res) => {
  try {
    const post = await PostService.updatePost(req.params.id, {
      status: "approved",
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectPost = async (req, res) => {
  try {
    const post = await PostService.updatePost(req.params.id, {
      status: "rejected",
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
