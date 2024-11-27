import jwt from "jsonwebtoken";

// In your authMiddleware.js
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // Attach user info to the request
    next();
  });
};
