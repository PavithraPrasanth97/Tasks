import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  // If not authenticated, redirect to login page
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If user role doesn't match the allowed roles, redirect to home page
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" />;
  }

  // If authenticated and authorized, render the child component (page)
  return children;
};

export default ProtectedRoute;
