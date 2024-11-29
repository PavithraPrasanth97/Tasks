import axios from "axios";

const api = axios.create({
  baseURL: "https://tasks-tmbackend.vercel.app",
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
  timeout: 20000,
});

export default api;
