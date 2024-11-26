// Adminpage.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import "./Adminpage.css";

const Adminpage = () => {
  const [users, setUsers] = useState([]); // Initialize an empty array for users
  const navigate = useNavigate(); // Hook for navigation

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await fetch("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        // Filter out the admin (if any) from the list of users
        const filteredUsers = data.filter((user) => user.role !== "admin");

        setUsers(filteredUsers); // Update the state with the filtered list of users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // Runs once when the component mounts

  // Handle user deletion (you may want to call a backend API for deleting)
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `http://localhost:5000/api/auth/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    navigate("/"); // Redirect to the Signup page
  };

  // Handle user name click (redirect to UserDetailPage with the user data)
  const handleUserClick = (user) => {
    navigate("/user-detail", { state: { user } }); // Pass user to UserDetailPage
  };

  return (
    <div className="admin-page">
      <div className="navbar">
        <div className="profile">
          <img
            src="https://via.placeholder.com/40"
            alt="Admin Profile"
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
