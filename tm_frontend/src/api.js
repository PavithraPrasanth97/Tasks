import axios from "axios";

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: "https://tasks-tmbackend.vercel.app/api", // Your backend URL
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
});

export default api;
