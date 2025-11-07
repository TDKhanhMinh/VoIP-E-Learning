import comment from "../model/comment.js";

export const createComment = async (data) => {
    return await comment.create(data);
};

export const getCommentsByPost = async (post_id, { page, limit }) => {
    const skip = (page - 1) * limit;
    const comments = await comment.find({ post_id }).sort({ createdAt: 1 }).skip(skip).limit(limit);
    const totalComments = await comment.countDocuments({ post_id });
    const hasMore = (page * limit) < totalComments;

    return ({
        comments: comments,
        hasMore: hasMore
    });
};
