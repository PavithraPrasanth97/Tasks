import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Signup Route Handler
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' role if not provided
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error); // Log the error for better debugging
    res.status(500).json({ message: "Server error" });
  }
};

// Login Route Handler
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set JWT in HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Send user data and token back to client
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/authControllers.js

// Fetch all users - admin only
export const getAllUsers = async (req, res) => {
  try {
    // Only allow admin users to access this route
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch all users from the database
    const users = await User.find({ role: { $ne: "admin" } }); // Excludes users with the 'admin' role
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by ID
// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Ensure that the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
