// controllers/taskController.js
import Task from "../models/Task.js";

// Get tasks for a specific user
export const getTasks = async (req, res) => {
  try {
    const { userId } = req.params; // Correct way to extract userId from params
    const tasks = await Task.find({ userId }); // Fetch tasks for the user
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Server Error");
  }
};

// Create a new task for a user
export const createTask = async (req, res) => {
  const { userId } = req.params; // userId comes from URL params
  const { taskName, date, status, phase } = req.body;

  if (!taskName || !date || !status || !phase) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newTask = new Task({
    userId,
    taskName,
    date,
    status,
    phase,
  });

  try {
    // Save the task in the database
    const savedTask = await newTask.save();
    res.status(201).json(savedTask); // Send the saved task back as response
    console.log("newtaskdatas", savedTask);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ error: "Error saving task" });
  }
};

// Update a specific task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskName, date, status, phase } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { taskName, date, status, phase },
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Server Error");
  }
};

// Delete a specific task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    res.send("Task deleted successfully");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Server Error");
  }
};

export const getUserTasks = async (req, res) => {
  const userId = req.params.userId; // Get userId from the URL parameter

  try {
    const tasks = await Task.find({ userId }); // Fetch tasks associated with the userId

    res.status(200).json(tasks); // Send tasks back to the client
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
