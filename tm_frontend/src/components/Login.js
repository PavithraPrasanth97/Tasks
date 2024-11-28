import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access login function from context

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { email, password });

      // If login is successful, store token and user data in AuthContext
      const userData = {
        token: response.data.token,
        role: response.data.user.role,
        user: response.data.user,
      };

      // Update AuthContext state with login details
      login(userData);

      // Redirect based on user role
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <div>
        <p>
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "underline" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
