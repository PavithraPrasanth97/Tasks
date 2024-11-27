// controllers/taskController.js
import Task from "../models/Task.js";
import User from "../models/User.js";

// Get tasks for a specific user
// Controller for fetching tasks by userId
export const getTasks = async (req, res) => {
  try {
    const { userId } = req.params; // Destructure userId from params
    console.log("Received userId in backend:", userId); // Log the received userId

    // Fetch tasks associated with the userId
    const tasks = await Task.find({ userId });

    console.log("Fetched tasks:", tasks); // Log fetched tasks

    // Check if tasks are found
    if (tasks.length > 0) {
      return res.json(tasks); // Return the tasks if found
    } else {
      return res.json([]); // Return an empty array if no tasks are found
    }
  } catch (err) {
    console.error("Error fetching tasks:", err); // Log the error
    return res.status(500).send("Server Error"); // Return a 500 status with error message
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

// export const getTasksByUserId = async (req, res) => {
//   const { userId } = req.params; // User ID from the route params

//   try {
//     // Fetch tasks associated with the userId
//     const tasks = await Task.find({ userId });

//     if (!tasks || tasks.length === 0) {
//       return res.status(404).json({ message: "No tasks found for this user" });
//     }

//     res.status(200).json(tasks); // Return the tasks for the user
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Function to get tasks for a specific user
// Function to get user details and tasks for a specific user
// Function to get user details and tasks for a specific user
export const getUserDetailsAndTasks = async (req, res) => {
  const { userId } = req.params; // Extract userId from params

  try {
    const user = await User.findById(userId); // Fetch user data
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasks = await Task.find({ userId }); // Get all tasks of the user
    res.status(200).json({ user, tasks }); // Send both user data and tasks to the frontend
  } catch (error) {
    console.error("Error fetching user details and tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
