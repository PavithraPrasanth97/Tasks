import React, { useState, useEffect, useContext } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Userpage.css";

const Userpage = () => {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    taskName: "",
    date: "",
    status: "waiting",
    phase: "phase1",
  });
  const [loading, setLoading] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const userId = auth.user?.id;

  useEffect(() => {
    const userId = auth.user?.id;
    if (userId) {
      console.log("User ID:", userId);
    }
  }, [auth.user?.id]);

  const handleCreateNewTask = () => {
    if (newTask.taskName && newTask.date && userId) {
      setLoading(true);
      api
        .post(`/api/tasks/${userId}`, newTask, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setTasks((prevTasks) => [...prevTasks, response.data]);
          setNewTask({
            taskName: "",
            date: "",
            status: "waiting",
            phase: "phase1",
          });
          setSuccessMessage("Task saved successfully!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((err) => {
          console.error("Error creating new task:", err.response || err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleShowTasks = () => {
    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    setLoading(true);
    api
      .get(`/api/tasks/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      })
      .finally(() => {
        setLoading(false);
      });

    setShowTasks(true);
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    api
      .put(`/api/tasks/${taskId}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...updatedTask } : task
          )
        );
      })
      .catch((err) => {
        console.error("Error updating task:", err);
      });
  };

  const handleDeleteTask = (taskId) => {
    api
      .delete(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== taskId));
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="user-page">
      <div className="navbar">
        <div className="navbar-left">
          <div className="username-role">
            <div className="username">{auth.user?.name}</div>
            <div className="role">{auth.user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="content">
        <button className="show-tasks-btn" onClick={handleShowTasks}>
          Show Tasks
        </button>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

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
            {loading ? "Saving..." : "Save Task"}
          </button>
        </div>

        {showTasks && (
          <div className="task-table-container">
            <button
              className="close-tasks-btn"
              onClick={() => setShowTasks(false)}
            >
              Close Tasks
            </button>
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
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.taskName}</td>
                      <td>{task.date}</td>
                      <td>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleUpdateTask(task._id, {
                              status: e.target.value,
                            })
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
                            handleUpdateTask(task._id, {
                              phase: e.target.value,
                            })
                          }
                        >
                          <option value="phase1">Phase 1</option>
                          <option value="phase2">Phase 2</option>
                          <option value="phase3">Phase 3</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="delete-task-btn"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No tasks available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Userpage;
