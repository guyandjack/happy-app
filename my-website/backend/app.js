// import des librairies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs"); // <-- pour le fallback

// import des fonctions
const { LP_DIR, startScheduler } = require("./utils/function/scheduler.js");
const logger = require("./logger.js");

// Import routes
const authRoutes = require("./routes/auth.routes.js");
const articleRoutes = require("./routes/article.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const recaptchaRoutes = require("./routes/recaptcha.routes.js");
const imagesRoutes = require("./routes/images.routes.js");

const app = express();

// ✅ CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://helveclick.ch",
      "http://localhost:5173",
      "http://localhost:4173",
    ];
    if (!origin) callback(null, true);
    else if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("CORS error: origin not allowed"));
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
app.use(cors(corsOptions));

// ✅ Static global (sert tout ./public à la racine → /images/... , /articles/...)
app.use(express.static(path.join(__dirname, "public")));

/**
 * ✅ Static dédié pour /images/landingPage
 * - Accepte les URL sans extension (…/2000 -> 2000.webp)
 * - Met les bons headers (cache revalidation + CORP)
 * - Évite les redirections implicites
 */
app.use(
  "/images/landingPage",
  express.static(LP_DIR, {
    extensions: ["webp"],
    redirect: false,
    etag: true,
    lastModified: true,
    maxAge: 0,
    setHeaders(res, filePath) {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      if (filePath && filePath.endsWith(".webp")) {
        res.setHeader("Content-Type", "image/webp");
      }
    },
  })
);

// ✅ Fallback image (en cas de 404, on renvoie une WebP → pas d'HTML ⇒ pas d'ORB)
/* app.use("/images/landingPage", (req, res, next) => {
  if (res.headersSent) return next();
  const placeholder = path.join(LP_DIR, "placeholder-1x1.webp");
  fs.readFile(placeholder, (err, buf) => {
    if (err) return next(err);
    res
      .status(404)
      .set({
        "Content-Type": "image/webp",
        "Cache-Control": "no-store",
        "Cross-Origin-Resource-Policy": "cross-origin",
      })
      .end(buf);
  });
}); */

// ✅ Body parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ✅ Logger HTTP via morgan -> Winston
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ✅ Compression / Cookies / Upload
// app.use(compression());
app.use(fileUpload());
app.use(cookieParser());

// ✅ Rate limit sur /api
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// ✅ Routes API
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/recaptcha", recaptchaRoutes);
app.use("/api/images", imagesRoutes);

// ✅ Test
app.get("/test", (req, res) => res.json({ message: "Hello, world of bugs" }));

logger.info("🚀 app listening ");

// ✅ Scheduler saisonnier (démarrage + planification quotidienne)
startScheduler();

// ✅ Middleware global d'erreurs
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
