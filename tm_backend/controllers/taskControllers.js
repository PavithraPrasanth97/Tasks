import Task from "../models/Task.js";
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId in backend:", userId);

    const tasks = await Task.find({ userId });

    console.log("Fetched tasks:", tasks); // Log fetched tasks

    if (tasks.length > 0) {
      return res.json(tasks);
    } else {
      return res.json([]);
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return res.status(500).send("Server Error");
  }
};

// Create a new task for a user
export const createTask = async (req, res) => {
  const { userId } = req.params;
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
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
    console.log("newtaskdatas", savedTask);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ error: "Error saving task" });
  }
};

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

export const getUserDetailsAndTasks = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasks = await Task.find({ userId });
    res.status(200).json({ user, tasks });
  } catch (error) {
    console.error("Error fetching user details and tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
