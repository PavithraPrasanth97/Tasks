import React, { createContext, useState, useEffect } from "react";

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
      setAuth(JSON.parse(userData));
    }
  }, []);

  // Login function
  const login = (userData) => {
    setAuth({
      isAuthenticated: true,
      role: userData.role,
      user: userData.user,
    });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  // Logout function
  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, user: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
