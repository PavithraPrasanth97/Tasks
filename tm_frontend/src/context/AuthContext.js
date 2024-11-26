import React, { createContext, useState, useEffect } from "react";

// Create a context for auth state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    user: null,
  });

  // This effect will run once on page load to check for an authenticated user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setAuth(JSON.parse(userData)); // Load user data from localStorage (or cookies)
    }
  }, []);

  // Login function to set auth state
  const login = (userData) => {
    setAuth({
      isAuthenticated: true,
      role: userData.role,
      user: userData.user,
    });
    localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
    localStorage.setItem("token", userData.token); // Save token to localStorage
  };

  // Logout function to clear auth state
  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, user: null });
    localStorage.removeItem("user"); // Remove user from localStorage
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
