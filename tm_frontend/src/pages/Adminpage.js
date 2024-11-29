import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Adminpage.css";

const Adminpage = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await fetch(
          "https://tasks-tmbackend.vercel.app/api/auth/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        const filteredUsers = data.filter((user) => user.role !== "admin");

        setUsers(filteredUsers);
        setUserCount(filteredUsers.length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {};

  const handleLogout = () => {
    navigate("/");
  };

  const handleUserClick = (user) => {
    navigate("/user-detail", { state: { user } });
  };

  return (
    <div className="admin-page">
      <div className="navbar">
        <div className="profile">
          <img
            src="https://via.placeholder.com/40"
            alt="Admin"
            className="profile-img"
          />
          <span className="username">Admin</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="user-table-container">
        <h2>User Details</h2>
        <p>Total Users: {userCount}</p>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <button
                    className="user-link"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.name}
                  </button>
                </td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user._id)}
                  >
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

export default Adminpage;
