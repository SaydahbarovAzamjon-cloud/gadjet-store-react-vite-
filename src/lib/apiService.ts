import axios from "axios";

// In dev: baseURL is empty, Vite proxy handles API calls (see vite.config.ts)
// In production: VITE_API_URL env variable points to the backend
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

export default apiService;
