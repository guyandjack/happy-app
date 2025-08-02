const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const contactRoutes = require("./routes/contact.routes");
const recaptchaRoutes = require("./routes/recaptcha.routes");
const imagesRoutes = require("./routes/images.routes");

// Create Express app
const app = express();

// Serve static files from the public directory (this should be first)
app.use(express.static(path.join(__dirname, "public")));

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:4173",
      "http://localhost:5173",
      "https://helveclick.ch",
      "https://happy-api-hd3g.onrender.com",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // autorise les requêtes sans origin (ex: mobile, curl)
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Set security HTTP headers (should be applied after CORS)
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false, // Allow loading resources from different origins
  })
);

// Parse JSON and URL-encoded request bodies (before routes)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger middleware (can be applied after body parsers)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Compress all responses (after parsing)
app.use(compression());

// Parse cookies
app.use(cookieParser());

// Rate limiting (apply after CORS and body parsers)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter); // Apply rate limiting on /api routes

// Routes (after static files and middlewares)
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/recaptcha", recaptchaRoutes);
app.use("/api/images", imagesRoutes);
app.get("/api/dashboard", (req, res) => {
  res.send("Hello World");
});

// Error handling middleware (should be applied last)
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
