const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const cookieParser = require("cookie-parser");
const winston = require("winston");
// Import routes
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const contactRoutes = require("./routes/contact.routes");
const recaptchaRoutes = require("./routes/recaptcha.routes");
const imagesRoutes = require("./routes/images.routes");

// Create Express app
const app = express();

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

// Créez un logger avec Winston
const logger = winston.createLogger({
  level: "info", // Vous pouvez ajuster le niveau (info, warn, error, etc.)
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Pour colorer les logs dans la console
        winston.format.simple() // Format simple du message
      ),
    }),
    new winston.transports.File({ filename: "logs/app.log" }), // Enregistre dans le fichier logs/app.log
  ],
});

// Rediriger console.log vers winston
console.log = function (message) {
  logger.info(message); // Logs tout message envoyé à console.log
};

// Rediriger console.error vers winston pour les erreurs
console.error = function (message) {
  logger.error(message); // Logs les erreurs envoyées à console.error
};

// Rediriger console.warn vers winston pour les avertissements
console.warn = function (message) {
  logger.warn(message); // Logs les avertissements envoyés à console.warn
};

// Log requests
app.use(
  morgan("dev", { stream: { write: (message) => logger.info(message.trim()) } })
);

// Apply CORS middleware before serving static files
app.use(cors(corsOptions));

// Serve static files from the public directory (this should be first)
app.use(express.static(path.join(__dirname, "public")));

// Répondre aux requêtes OPTIONS (pré-vol CORS)
app.options("*", cors(corsOptions));

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

// Middleware de gestion des erreurs (appliqué en dernier)
app.use((err, req, res, next) => {
  // Loguer l'erreur dans les logs (fichier et console)
  logger.error(err.stack);

  // Déterminer le code de statut et le type d'erreur
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  // Répondre avec un message d'erreur et la stack trace si en développement
  res.status(statusCode).json({
    status,
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
