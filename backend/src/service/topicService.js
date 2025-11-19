import Topic from "../model/topic.js";

export const createTopic = async (data) => {
  return await Topic.create(data);
};

export const getAllTopics = async () => {
  const topics = await Topic.aggregate([
    { $sort: { createdAt: -1 } },

    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "topic_id",
        as: "posts",
      },
    },

    {
      $addFields: {
        postCount: { $size: "$posts" },
      },
    },

    {
      $addFields: {
        latestPost: {
          $arrayElemAt: [
            {
              $slice: [
                {
                  $sortArray: {
                    input: "$posts",
                    sortBy: { createdAt: -1 },
                  },
                },
                1,
              ],
            },
            0,
          ],
        },
      },
    },

    { $project: { posts: 0 } },
  ]);
  return topics;
};

export const updateTopic = async (id, data) => {
  const topic = await Topic.findByIdAndUpdate(id, data, { new: true });
  return topic;
};

export const deleteTopic = async (id) => {
  await Topic.findByIdAndDelete(id);
};
