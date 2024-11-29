import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserDetailPage.css";

const UserDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state && state.user) {
      const userId = state.user._id;

      const fetchUserDetailsAndTasks = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Token not found");
          }

          const response = await fetch(
            `https://tasks-tmbackend.vercel.app/api/tasks/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user details and tasks");
          }

          const data = await response.json();
          setUserDetails(data.user);
          setTasks(data.tasks);
        } catch (error) {
          console.error("Error fetching user details and tasks:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetailsAndTasks();
    }
  }, [state]);

  const handleBackClick = () => {
    navigate("/admin");
  };
  if (loading) {
    return <div>Loading user details...</div>;
  }

  return (
    <div className="user-detail-page">
      <button onClick={handleBackClick}>Back to Admin Page</button>{" "}
      <h2>User Detail</h2>
      {userDetails ? (
        <div>
          <h3>{userDetails.name}</h3>
          <p>Email: {userDetails.email}</p>

          <h4>Tasks</h4>
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Phase</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.taskName}</td>
                    <td>{task.status}</td>
                    <td>{new Date(task.date).toLocaleDateString()}</td>
                    <td>{task.phase}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No tasks found for this user.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default UserDetailPage;
