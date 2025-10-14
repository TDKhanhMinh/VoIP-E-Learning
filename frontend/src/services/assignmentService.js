import http from "./http";

export const assignmentService = {
    getAllAssignments: async () => {
        const res = await http.get("/assignment");
        return res.data;
    },
    getAssignmentsById: async (id) => {
        const res = await http.get(`/assignment/${id}`);
        return res.data;
    },
    getAllAssignmentsByClass: async (class_id) => {
        const res = await http.get(`/assignment/class/${class_id}`);
        return res.data;
    },
    createAssignment: async (data) => {
        const res = await http.post("/assignment", data);
        return res.data;
    },
    deleteAssignment: async (id) => {
        const res = await http.delete(`/assignment/${id}`);
        return res.data;
    },
    updateAssignment: async (id, data) => {
        const res = await http.put(`/assignment/${id}`, data);
        return res.data;
    }
}
