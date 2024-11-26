// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup"; // Default import
import Login from "./components/Login"; // Default import
import Userpage from "./components/Userpage"; // Default import
import Adminpage from "./pages/Adminpage";
import UserDetailPage from "./pages/UserDetailPage";
import ProtectedRoute from "./components/ProtectedRoute"; // ProtectedRoute component
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["user", "admin"]}>
                  <Userpage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Adminpage />
                </ProtectedRoute>
              }
            />
            <Route path="/user-detail" element={<UserDetailPage />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
