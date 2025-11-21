import http from "./http";
export const commentService = {
  createComment: async (post_id, payload) => {
    const res = await http.post(`comment/${post_id}`, payload);
    return res.data;
  },
  getComments: async (class_id, { page, limit }) => {
    const res = await http.get(`comment/${class_id}`, {
      params: { page, limit },
    });
    console.log(res.data);
    return res.data;
  },
  deleteComment: async (comment_id) => {
    const res = await http.delete(`comment/${comment_id}`);
    return res.data;
  },
  updateComment: async (comment_id, payload) => {
    const res = await http.put(`comment/${comment_id}`, payload);
    return res.data;
  },
};
