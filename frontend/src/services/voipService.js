import http from "./http";

export const voipService = {
    getMySipCredentials: async (id) => {
        const res = await http.get(`/voip/credentials/${id}`);
        return res.data;
    }
};
