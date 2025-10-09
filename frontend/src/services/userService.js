
import http from './http';
export const userService = {
    createUser: async (data) => {
        const res = await http.post("user", data);
        return res.data;
    },
    getUserById: async (id) => {
        const res = await http.get("user");
        return res.data.find(item => item._id === id);
    },
    getAllUsers: async () => {
        const res = await http.get("user")
        return res.data;
    },
    updateUser: async (id, data) => {
        const res = await http.put(`user/${id}`, data);
        return res.data;
    },
    deleteUser: async (id) => {
        const res = await http.delete(`user/${id}`);
        return res.data;
    }

};