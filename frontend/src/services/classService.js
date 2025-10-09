import http from "./http"

export const classService = {
    getAllClass: async () => {
        const res = await http.get("/class");
        return res.data;
    },
    getClassById: async (id) => {
        // const res = await http.get(`/class/${id}`);
        const res = await http.get("/class");
        return res.data.find(item => item._id === id);
    }
    ,
    createClass: async (data) => {
        const res = await http.post("/class", data);
        return res.data;
    },
    updateClass: async (id, data) => {
        const res = await http.put(`/class/${id}`, data);
        return res.data;
    },
    deleteClass: async () => {

    }
}