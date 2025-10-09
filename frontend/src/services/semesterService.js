import http from "./http";

export const semesterService = {
    getAllSemesters: async () => {
        const res = await http.get("semester");
        return res.data;
    },
    getSemesterById: async (id) => {
        const res = await http.get("semester");
        return res.data.find(item => item._id === id);
    },
    createSemester: async (data) => {
        const res = await http.post("semester", data);
        return res.data;
    },
    updateSemester: async (id, data) => {
        const res = await http.put(`semester/${id}`, data);
        return res.data;
    },
    deleteSemester: async (id) => {
        const res = await http.delete(`semester/${id}`);
        return res.data;
    },


};