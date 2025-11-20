import http from "./http";

export const testSessionService = {
  getTestSessionsByTestAndStudent: async (testId) => {
    const res = await http.get(`/test-session/test/${testId}?_t=${Date.now()}`);
    return res.data;
  },

  updateTestSession: async (sessionId, data) => {
    const res = await http.patch(`/test-session/${sessionId}`, data, { silent: true });
    return res.data;
  },
};
