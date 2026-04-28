import axios from "axios";

// baseURL is empty — all requests go through Vite proxy (avoids CORS & cookie issues)
const apiService = axios.create({
  baseURL: "",
  withCredentials: true,
});

export default apiService;
