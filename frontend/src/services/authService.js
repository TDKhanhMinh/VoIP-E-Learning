
import http from './http';
export const authService = {
  login: async (email, password) => {
    const res = await http.post("auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    sessionStorage.setItem("userId", JSON.stringify(res.data._id));
    sessionStorage.setItem("name", res.data.full_name);
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  }
};
