
import http from './http';
export const postService = {
    createPost: async (class_id, payload) => {
        const res = await http.post(`post/${class_id}`, payload);
        return res.data;
    },
    getPosts: async (class_id) => {
        const res = await http.get(`post/${class_id}`);
        console.log("Posts", res.data);

        return res.data;
    },
};
