import http from "./http"

export const announcementService = {
    createAnnouncement: async (data) => {
        const res = await http.post('/announcement', data);
        return res.data;
    },
    getAllAnnouncement: async () => {
        const res = await http.get('/announcement');
        return res.data;
    },
    getAnnouncementById: async (id) => {
        const res = await http.get(`/announcement/${id}`);
        return res.data;
    },
    getAnnouncementByClassId: async (id) => {
        const res = await http.get(`/announcement/class/${id}`);
        console.log(res);

        return res.data;
    },
    getAnnouncementByCreatorId: async (id) => {
        const res = await http.get(`/announcement/creator/${id}`);
        return res.data;
    },
    updateAnnouncement: async (id, data) => {
        const res = await http.put(`/announcement/${id}`, data);
        return res.data;
    },
    deleteAnnouncement: async (id) => {
        const res = await http.delete(`/announcement/${id}`);
        return res.data;
    },

}