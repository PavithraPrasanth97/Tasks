import axios from "axios";

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: "https://tasks-tmbackend.vercel.app", // Your backend URL
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
  timeout: 20000,
});

export default api;
