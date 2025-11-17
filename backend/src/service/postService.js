import post from "../model/post.js";

export const createPost = async (data) => {
    return await post.create(data);
};

export const getPostsByClass = async (class_id) => {
    return await post.find({ class_id }).sort({ createdAt: -1 });
};
