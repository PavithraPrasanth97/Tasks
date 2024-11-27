import jwt from "jsonwebtoken";

// In your authMiddleware.js
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", ""); // Extract token from Authorization header
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: "Invalid token." }); // Invalid or expired token
  }
};
