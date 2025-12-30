import http from "./http";

export const submissionService = {
  createSubmission: async (data) => {
    const res = await http.post("/submission", data);
    return res.data;
  },
  updateSubmission: async (id, data) => {
    const res = await http.put(`/submission/${id}`, data);
    return res.data;
  },
  deleteSubmission: async (id) => {
    const res = await http.delete(`/submission/${id}`);
    return res.data;
  },
  getAllSubmissions: async () => {
    const res = await http.get(`/submission`);
    return res.data;
  },
  getSubmissionById: async (id) => {
    const res = await http.get(`/submission/${id}`);
    return res.data;
  },
  getSubmissionByAssignmentId: async (id) => {
    const res = await http.get(`/submission/assignment/${id}`);
    return res.data;
  },
  getSubmissionByUserId: async (id) => {
    const res = await http.get(`/submission/student/${id}`);
    return res.data;
  },
};
