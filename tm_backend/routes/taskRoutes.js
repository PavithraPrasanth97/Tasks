import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskControllers.js"; // Make sure .js extension is included

const taskrouter = express.Router();

// API routes for tasks
taskrouter.get(`/:userId`, getTasks); // Get tasks for a specific user
taskrouter.post(`/:userId`, createTask); // Create a new task for a user
taskrouter.put(`/:taskId`, updateTask); // Update a specific task
taskrouter.delete(`/:taskId`, deleteTask); // Delete a specific task

export default taskrouter;
