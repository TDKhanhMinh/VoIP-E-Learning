import post from "../model/post.js";
import mongoose from "mongoose";

export const createPost = async (data) => {
  return await post.create(data);
};

export const getPostsByClass = async (class_id) => {
  return await post.find({ class_id }).sort({ createdAt: -1 });
};

export const getPostsByTopic = async (topic_id) => {
  return await post.find({ topic_id }).sort({ createdAt: -1 });
};

export const getForumPosts = async () => {
  return await post.aggregate([
    {
      $match: {
        topic_id: {
          $exists: true,
          $ne: null,
        },
      },
    },
    {
      $lookup: {
        from: "topics",
        localField: "topic_id",
        foreignField: "_id",
        as: "topic",
      },
    },
    {
      $unwind: {
        path: "$topic",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        _idString: { $toString: "$_id" },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_idString",
        foreignField: "post_id",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentCount: { $size: "$comments" },
      },
    },
    {
      $project: {
        _idString: 0,
        comments: 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
};

export const updatePost = async (id, data) => {
  const updatedPost = await post.findByIdAndUpdate(id, data, { new: true });
  return updatedPost;
};
export const deletePost = async (id) => {
  await post.findByIdAndDelete(id);
};

export const getPostById = async (id) => {
  const posts = await post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "topics",
        localField: "topic_id",
        foreignField: "_id",
        as: "topic",
      },
    },
    {
      $unwind: {
        path: "$topic",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        _idString: { $toString: "$_id" },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_idString",
        foreignField: "post_id",
        as: "comments",
        pipeline: [{ $sort: { createdAt: -1 } }],
      },
    },
    {
      $project: {
        _idString: 0,
      },
    },
  ]);
  return posts[0];
};
