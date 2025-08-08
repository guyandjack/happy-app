const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const cookieParser = require("cookie-parser");

const logger = require("./logger.js"); // ✅ Utilise ton logger Winston centralisé

// Import routes
const authRoutes = require("./routes/auth.routes.js");
const articleRoutes = require("./routes/article.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const recaptchaRoutes = require("./routes/recaptcha.routes.js");
const imagesRoutes = require("./routes/images.routes.js");

const app = express();

// ✅ Configuration CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://helveclick.ch",
      "http://localhost:5173",
      "http://localhost:4173",
    ];

    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS error: origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
  ],
};

// ✅ CORS middleware (avant tout)
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// ✅ Fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// ✅ Headers de sécurité
/*app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);*/

// ✅ Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Logger HTTP via morgan -> Winston
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// ✅ Compression (désactivée ici)
/*app.use(compression());*/

// ✅ Cookies
app.use(cookieParser());

// ✅ Limiteur de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/recaptcha", recaptchaRoutes);
app.use("/api/images", imagesRoutes);

// ✅ Route de test
app.get("/test", (req, res) => {
  res.json({ message: "Hello, world of bugs" });
});

logger.info("🚀 app listening ");

// ✅ Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(`Erreur serveur: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    status: err.status || 500,
    body: req.body,
    query: req.query,
  });

  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Erreur serveur",
    status: err.status || 500,
  });
});

module.exports = app;
