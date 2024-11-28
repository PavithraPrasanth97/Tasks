import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import taskrouter from "./routes/taskRoutes.js";
import { verifyToken } from "./middleware/verifyToken.js";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 5000;

server.use(cookieParser());

// Middleware
server.use(express.json());
server.use(
  cors({
    origin: "https://tasks-tmfrontend.vercel.app/", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
); // Allow cross-origin requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Routes
server.use("/api/auth", authRoutes);
server.use("/api/tasks", verifyToken, taskrouter);

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
