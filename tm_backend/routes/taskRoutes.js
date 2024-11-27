import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUserDetailsAndTasks, // Ensure this function is imported
} from "../controllers/taskControllers.js"; // Correct import path

const taskrouter = express.Router();

// API routes for tasks
taskrouter.get(`/:userId`, getTasks); // Get tasks for a specific user
taskrouter.post(`/:userId`, createTask); // Create a new task for a user
taskrouter.put(`/:taskId`, updateTask); // Update a specific task
taskrouter.delete(`/:taskId`, deleteTask); // Delete a specific task
taskrouter.get("/user/:userId", getUserDetailsAndTasks); // Correct endpoint to get user details and tasks

export default taskrouter;
