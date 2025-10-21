import axios from "axios";
import axiosRetry from "axios-retry";
import { loadingController } from "../context/LoadingController";
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout:
    60000,
});


axiosRetry(http, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

const cache = new Map();

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  loadingController.start();
  if (config.method === "get" && config.cache !== false) {
    const key = config.url + JSON.stringify(config.params || {});
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < 60000) {
      return Promise.reject({ __fromCache: true, data: cached.data });
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    loadingController.stop();
    if (response.config.method === "get" && response.config.cache !== false) {
      const key = response.config.url + JSON.stringify(response.config.params || {});
      cache.set(key, { data: response, time: Date.now() });
    }
    return response;
  },
  (error) => {
    loadingController.stop();
    if (error.__fromCache) return error.data;
    return Promise.reject(error);
  }
);

export default http;
