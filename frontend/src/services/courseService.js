import http from './http';
export const courseService = {
    getCourses: async () => {
        const res = await http.get('/course');
        return res.data;
    },
    getCourseById: async (id) => {
        // const res = await http.get(`/course/${id}`);
        const res = await http.get('/course');
        return res.data.find(item => item._id === id);
    },
    createCourse: async (course) => {
        const res = await http.post('/course', course);
        return res.data;
    },
    updateCourse: async (id, data) => {
        const res = await http.put(`/course/${id}`, data);
        return res.data;
    },
    deleteCourse: async (courseId) => {
        const res = await http.delete(`/course/${courseId}`);
        return res.data;
    },
}