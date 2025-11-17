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

export const getPosts = async (req, res) => {
    const posts = await PostService.getPostsByClass(req.params.class_id);
    res.json(posts);
};

