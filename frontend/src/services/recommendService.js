import http from "./http";

export const recommendService = {
  getDocuments: async () => {
    const res = await http.get("/recommend/list");
    return res.data;
  },

  getDocument: async (id) => {
    const res = await http.get(`/recommend/${id}`);
    return res.data;
  },

  createDocument: async (documentData) => {
    const res = await http.post("/recommend/create", documentData);
    return res.data;
  },

  updateDocument: async (id, documentData) => {
    const res = await http.put(`/recommend/${id}`, documentData);
    return res.data;
  },

  deleteDocument: async (id) => {
    const res = await http.delete(`/recommend/${id}`);
    return res.data;
  },

  recommendDocuments: async (query, topK = 5) => {
    const res = await http.post("/recommend/recommend", { query, topK });
    return res.data;
  },
};
