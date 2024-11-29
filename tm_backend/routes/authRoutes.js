import express from "express";
import {
  signup,
  login,
  getAllUsers,
  deleteUser,
  getTasksByUserId,
} from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/users", verifyToken, getAllUsers);

router.delete("/users/:id", verifyToken, deleteUser);

router.get("/user/:userId", getTasksByUserId);
export default router;
