import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import taskrouter from "./routes/taskRoutes.js";
import { verifyToken } from "./middleware/verifyToken.js";
import helmet from "helmet"; // Import helmet

dotenv.config();

const server = express();
const PORT = process.env.PORT || 5000;

// Middleware
server.use(cookieParser());
server.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
server.use(
  cors({
    origin: process.env.FRONT_END_URL, // Frontend URL (e.g., 'http://localhost:3000')
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Use helmet to set security headers including CSP
server.use(helmet());

// Custom CSP Header configuration
server.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"], // Disallow all sources by default
      scriptSrc: [
        "'self'", // Allow scripts from the same origin
        "https://vercel.live", // Allow scripts from Vercel (important for live feedback.js)
        "https://cdn.jsdelivr.net", // Allow scripts from a CDN (if needed)
        "https://www.gstatic.com", // Google Fonts for inline JavaScript
        "https://*.vercel.live", // Allow other subdomains of Vercel
      ],
      styleSrc: [
        "'self'", // Allow styles from the same origin
        "https://fonts.googleapis.com", // Allow Google Fonts
      ],
      imgSrc: [
        "'self'", // Allow images from the same origin
        "data:", // Allow inline images (base64 encoded)
      ],
      fontSrc: [
        "'self'", // Allow fonts from the same origin
        "https://fonts.gstatic.com", // Allow Google Fonts
      ],
      connectSrc: [
        "'self'", // Allow connections (AJAX requests) from the same origin
        "https://api.vercel.com", // Allow Vercel API requests (if applicable)
      ],
      objectSrc: ["'none'"], // Disallow Flash or other object-based resources
      styleSrcElem: ["'self'", "https://fonts.googleapis.com"], // Allow external style sources for elements
      scriptSrcElem: ["'self'", "https://cdn.jsdelivr.net"], // Allow external script sources for elements
      frameSrc: ["'self'"], // Allow framing from the same origin (if using iframes)
    },
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Routes
server.use("/auth", authRoutes);
server.use("/tasks", verifyToken, taskrouter);

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
