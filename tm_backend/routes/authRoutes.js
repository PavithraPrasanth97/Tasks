import express from "express";
import {
  signup,
  login,
  getAllUsers,
  deleteUser,
  getTasksByUserId,
  // logout,
  // verifyToken,
} from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

router.get("/users", verifyToken, getAllUsers);

router.delete("/users/:id", verifyToken, deleteUser);

router.get("/user/:userId", getTasksByUserId); // userId is part of the route
// router.get("/logout", logout);

// Verify Token Route
// router.get("/verify", verifyToken);

export default router;
