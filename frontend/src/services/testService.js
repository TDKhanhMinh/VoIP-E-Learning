import http from "./http";

export const testService = {
  getAllTests: async () => {
    const res = await http.get("/online-test");
    return res.data;
  },
  getTestsByClass: async (classId) => {
    const res = await http.get(`/online-test/class/${classId}`);
    return res.data;
  },
  getTestById: async (id) => {
    const res = await http.get(`/online-test/${id}`);
    return res.data;
  },
  getTestByStudent: async () => {
    const res = await http.get(`/online-test/student/`);
    return res.data;
  },
  createTest: async (testData) => {
    const res = await http.post("/online-test", testData);
    return res.data;
  },
  updateTest: async (id, testData) => {
    const res = await http.put(`/online-test/${id}`, testData);
    return res.data;
  },
  updateTestQuestions: async (id, questions) => {
    const res = await http.put(`/online-test/${id}/questions`, { questions });
    return res.data;
  },
  deleteTest: async (id) => {
    const res = await http.delete(`/online-test/${id}`);
    return res.data;
  },
  createTestAttempt: async (sessionId) => {
    const res = await http.post(`/attempt/${sessionId}`);
    return res.data;
  },
  uploadQuestionsFromWord: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await http.post("/upload-question/word", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = res.data;
      console.log("Parsed questions:", data);
      return data;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  },
};
