import http from "./http"

export const attendanceService = {
    createAttendance: async (attendanceData) => {
        const res = await http.post('/attendance', attendanceData);
        return res.data;
    },
    getAttendanceByClassId: async (id) => {
        const res = await http.get(`/attendance/${id}`);
        return res.data;
    },
    updateAttendance: async (attendanceId, attendanceData) => {
        const res = await http.put(`/attendance/${attendanceId}`, attendanceData);
        return res.data;
    }
}