import http from "./http";

export const enrollmentService = {
  getAll: async () => {
    const res = await http.get(`/enrollment/`);
    return res.data;
  },
  getAllEnrollments: async (class_id) => {
    const res = await http.get(`/enrollment/class/${class_id}`);
    return res.data;
  },
  getAllEnrollmentsByStudentId: async (id) => {
    console.log("hshas", id);
    const res = await http.get(`/enrollment/student/${id}`);
    return res.data;
  },
  createEnrollment: async (data) => {
    const res = await http.post("/enrollment", data);
    return res.data;
  },
  deleteEnrollment: async (id) => {
    const res = await http.delete(`/enrollment/${id}`);
    return res.data;
  },
};
