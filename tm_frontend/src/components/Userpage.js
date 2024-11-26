import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import "./Userpage.css";

const Userpage = () => {
  const { auth } = useContext(AuthContext); // Use context to get auth state
  const [tasks, setTasks] = useState([]); // Task list
  const [newTask, setNewTask] = useState({
    taskName: "",
    date: "",
    status: "waiting",
    phase: "phase1",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate(); // Hook for navigation
  const userId = auth.user?.id;

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/tasks/${userId}`)
        .then((response) => {
          setTasks(response.data);
        })
        .catch((err) => {
          console.error("Error fetching tasks:", err);
        });
    } else {
      console.error("User ID is not available!");
    }
  }, [userId]);

  // Create a new task for a user
  const handleCreateNewTask = () => {
    const userId = auth.user?.id;
    console.log("userid", userId);
    if (newTask.taskName && newTask.date && userId) {
      setLoading(true);
      console.log("Sending Task Data:", newTask);
      axios
        .post(`http://localhost:5000/api/tasks/${userId}`, newTask) // Ensure the URL is correct
        .then((response) => {
          console.log("Task saved successfully:", response.data);
          setTasks((prevTasks) => [...prevTasks, response.data]);
          setNewTask({
            taskName: "",
            date: "",
            status: "waiting",
            phase: "phase1",
          });
          setLoading(false);
          setSuccessMessage("Task saved successfully!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((err) => {
          console.error("Error creating new task:", err.response || err);
          setLoading(false);
        });
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${taskId}`) // Deleting task based on taskId
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== taskId)); // Remove task from local state
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
      });
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    axios
      .put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask)
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...updatedTask } : task
          )
        );
      })
      .catch((err) => {
        console.error("Error updating task:", err.response || err);
      });
  };

  return (
    <div className="user-page">
      <div className="navbar">
        <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      <div className="task-table-container">
        <h2>Task Details</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* Task Form */}
        <div className="task-form">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.taskName}
            onChange={(e) =>
              setNewTask({ ...newTask, taskName: e.target.value })
            }
          />
          <input
            type="date"
            value={newTask.date}
            onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="waiting">Waiting</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={newTask.phase}
            onChange={(e) => setNewTask({ ...newTask, phase: e.target.value })}
          >
            <option value="phase1">Phase 1</option>
            <option value="phase2">Phase 2</option>
            <option value="phase3">Phase 3</option>
          </select>
          <button
            className="save-task-btn"
            onClick={handleCreateNewTask}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Task Table */}
        <table className="task-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Phase</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.taskName}</td>
                <td>{task.date}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateTask(task._id, { status: e.target.value })
                    }
                  >
                    <option value="waiting">Waiting</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <select
                    value={task.phase}
                    onChange={(e) =>
                      handleUpdateTask(task._id, { phase: e.target.value })
                    }
                  >
                    <option value="phase1">Phase 1</option>
                    <option value="phase2">Phase 2</option>
                    <option value="phase3">Phase 3</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDeleteTask(task._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Userpage;
