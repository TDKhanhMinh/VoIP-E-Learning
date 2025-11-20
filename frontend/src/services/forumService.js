import http from "./http";

export const forumService = {
  getAllTopics: async () => {
    const res = await http.get("/topic", { cache: false });
    return res.data;
  },

  getTopicById: async (id) => {
    const res = await http.get(`/forum/topics/${id}`, { cache: false });
    return res.data;
  },

  createTopic: async (data) => {
    const res = await http.post("/topic", data);
    return res.data;
  },

  updateTopic: async (id, data) => {
    const res = await http.put(`/topic/${id}`, data);
    return res.data;
  },

  deleteTopic: async (id) => {
    const res = await http.delete(`/topic/${id}`);
    return res.data;
  },

  getAllPosts: async (params = {}) => {
    const res = await http.get("post/forum", { params, cache: false });
    return res.data;
  },

  getPostsByTopic: async (topicId) => {
    const res = await http.get(`/forum/posts/topic/${topicId}`, {
      cache: false,
    });
    return res.data;
  },

  getPostById: async (id) => {
    const res = await http.get(`/post/forum/${id}`, { cache: false });
    return res.data;
  },

  getMyPosts: async () => {
    const res = await http.get("/forum/posts/my", { cache: false });
    return res.data;
  },

  createPost: async (data, topic_id) => {
    const res = await http.post(`/post/forum/${topic_id}`, data);
    return res.data;
  },

  updatePost: async (id, data) => {
    const res = await http.put(`/post/forum/${id}`, data);
    return res.data;
  },

  deletePost: async (id) => {
    const res = await http.delete(`/post/forum/${id}`);
    return res.data;
  },

  approvePost: async (id) => {
    const res = await http.patch(`/post/forum/${id}/approve`);
    return res.data;
  },

  rejectPost: async (id) => {
    const res = await http.patch(`/post/forum/${id}/reject`);
    return res.data;
  },

  addComment: async (postId, author_id, author_name, content) => {
    const res = await http.post(`/comment/${postId}`, {
      author_id,
      author_name,
      content,
    });
    return res.data;
  },

  deleteComment: async (postId, commentId) => {
    const res = await http.delete(
      `/forum/posts/${postId}/comments/${commentId}`
    );
    return res.data;
  },
};
