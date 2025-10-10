import http from "./http";

export const enrollmentService = {
    getAllEnrollments: async (class_id) => {
        const res = await http.get(`/enrollment/class/${class_id}`);
        return res.data;
    },
    createEnrollment: async (data) => {
        const res = await http.post("/enrollment", data);
        return res.data;
    },
    deleteEnrollment: async (id) => {
        const res = await http.delete(`/enrollment/${id}`);
        return res.data;
    }
}