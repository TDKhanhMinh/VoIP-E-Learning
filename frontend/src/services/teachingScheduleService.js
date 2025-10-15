import http from "./http"

export const teachingScheduleService = {


    getScheduleById: async (id) => {
        const res = await http.get(`/schedule/${id}`);
        return res.data;
    },
    getScheduleByTeacherId: async (id) => {
        const res = await http.get(`/schedule/teacher/${id}`);
        return res.data;
    },
    getScheduleByClassId: async (id) => {
        const res = await http.get(`/schedule/class/${id}`);
        return res.data;
    }

}