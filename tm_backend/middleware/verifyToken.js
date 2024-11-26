import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt; // Get token from headers or cookies

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("Decoded user:", decoded); // Log decoded user data
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};
