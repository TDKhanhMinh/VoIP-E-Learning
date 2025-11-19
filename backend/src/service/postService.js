import post from "../model/post.js";

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
