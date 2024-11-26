import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserDetailPage = () => {
  const location = useLocation(); // Get the state passed during navigation
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]); // State to store user tasks
  const navigate = useNavigate();

  // Fetch the user data from location state and the tasks from the API
  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user); // Set the user data passed from Admin Page

      // Fetch tasks associated with the user
      const fetchTasks = async () => {
        try {
          const token = localStorage.getItem("token"); // Retrieve token from localStorage
          if (!token) {
            throw new Error("Token not found");
          }

          const response = await fetch(
            `http://localhost:5000/api/tasks/tasks/user/${location.state.user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token for authentication
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }

          const data = await response.json();
          setTasks(data); // Set tasks data
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };

      fetchTasks();
    } else {
      navigate("/admin"); // Redirect back to Admin Page if no user data is passed
    }
  }, [location, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-detail-page">
      <h2>User Details</h2>
      <div>
        <strong>Name:</strong> {user.name}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Role:</strong> {user.role}
      </div>

      {/* Display User Tasks */}
      <h3>Assigned Tasks</h3>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <strong>{task.title}</strong>: {task.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks assigned to this user.</p>
      )}

      {/* Back Button to Admin Page */}
      <button onClick={() => navigate("/admin")}>Back to Admin Page</button>
    </div>
  );
};

export default UserDetailPage;
