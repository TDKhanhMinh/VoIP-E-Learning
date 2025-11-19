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
    const res = await http.get(`/forum/posts/${id}`, { cache: false });
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
    const res = await http.put(`/post/${id}`, data);
    return res.data;
  },

  deletePost: async (id) => {
    const res = await http.delete(`/forum/posts/${id}`);
    return res.data;
  },

  approvePost: async (id) => {
    const res = await http.patch(`/forum/posts/${id}/approve`);
    return res.data;
  },

  rejectPost: async (id) => {
    const res = await http.patch(`/forum/posts/${id}/reject`);
    return res.data;
  },

  addComment: async (postId, content) => {
    const res = await http.post(`/forum/posts/${postId}/comments`, {
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
