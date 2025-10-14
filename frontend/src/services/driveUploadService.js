import http from "./http"

export const driveUploadService = {
    uploadToDrive: async (data) => {
        const res = await http.post("/drive/upload", data);
        return res.data;
    },
    deleteFromDrive: async (id) => {
        const res = await http.delete(`/delete/${id}`);
        return res.data;
    }
}