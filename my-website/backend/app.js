const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const contactRoutes = require("./routes/contact.routes");
const recaptchaRoutes = require("./routes/recaptcha.routes");
//const contentRoutes = require('./routes/content.routes');

// Create Express app
const app = express();

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173", // Development server
      "https://www.my-website.ch", // Production site
      undefined, // Allow requests with no origin (like mobile apps, curl requests)
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false, // Allow loading resources from different origins
  })
);

// Parse JSON request body
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Compress all responses
app.use(compression());

// Parse cookies
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads directory with CORS enabled
app.use(
  "/api/uploads",
  (req, res, next) => {
    // Set CORS headers specifically for static files
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins for static files
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("cross-origin-resource-policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve frontend build files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "dist")));

  // For any route not handled by the API, serve the index.html
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
    }
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/recaptcha", recaptchaRoutes);

/* // Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
}); */

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
