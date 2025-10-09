
import http from './http';
export const authService = {
  login: async (email, password) => {
    const res = await http.post("auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  }
};
