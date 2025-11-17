import http from "./http";

export const attemptService = {
  getAttemptsByStudentAndTest: async (testId) => {
    const res = await http.get(`/attempt/student-attempts/${testId}`, {
      cache: false,
    });
    return res.data;
  },
};
