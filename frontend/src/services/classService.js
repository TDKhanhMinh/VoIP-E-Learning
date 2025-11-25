import http from "./http";

export const classService = {
  getAllClass: async () => {
    const res = await http.get("/class");
    return res.data;
  },
  getClassById: async (id) => {
    const res = await http.get(`/class/${id}`);
    return res.data;
  },
  getUserClasses: async () => {
    const res = await http.get(`/class/user`);
    return res.data;
  },
  getClassesByTeacher: async (teacherId) => {
    const res = await http.get("/class");
    console.log("data", res.data);
    console.log("teacher ", teacherId.split('"').join(""));
    console.log(
      "filter ",
      res.data.filter(
        (item) =>
          item.teacher.toString() === teacherId.split('"').join("").toString()
      )
    );
    return res.data.filter(
      (item) =>
        item.teacher.toString() === teacherId.split('"').join("").toString()
    );
  },
  getClassStudents: async (classId) => {
    const res = await http.get(`/class-student/class/${classId}`);
    return res.data;
  },
  createClass: async (data) => {
    const res = await http.post("/class", data);
    return res.data;
  },
  updateClass: async (id, data) => {
    const res = await http.put(`/class/${id}`, data);
    return res.data;
  },
  deleteClass: async () => {},
};
