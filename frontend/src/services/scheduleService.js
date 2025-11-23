import http from "./http";

export const scheduleService = {
  getScheduleBySemester: async (semesterId) => {
    const res = await http.get(`/schedule/${semesterId}`, {
      cache: false,
    });
    return res.data;
  },
  addAbsenceDate: async (classId, date) => {
    const res = await http.post(`/class/${classId}/absence`, { date });
    return res.data;
  },
};
