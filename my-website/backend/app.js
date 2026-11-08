// import des librairies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
// import des fonctions
const logger = require("./logger.js");
const testNotif = require("./utils/function/testNotification.js");
const { isAllowedOrigin } = require("./config/security");
const { redactLogData } = require("./utils/function/redactLogData");
const {
  sitePublicRoot,
  siteDistributionRoot,
} = require("./utils/function/sitePublicPaths.js");

// Import routes
const authRoutes = require("./routes/auth.routes.js");
const articleRoutes = require("./routes/article.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const recaptchaRoutes = require("./routes/recaptcha.routes.js");

const app = express();

app.disable("x-powered-by");

if (process.env.TRUST_PROXY) {
  app.set("trust proxy", process.env.TRUST_PROXY);
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "frame-src": ["'self'", "https://www.google.com"],
        "img-src": ["'self'", "data:", "https:"],
        "script-src": ["'self'", "https://www.google.com", "https://www.gstatic.com"],
        "upgrade-insecure-requests":
          process.env.NODE_ENV === "production" ? [] : null,
      },
    },
  })
);

// CORS is a browser policy, not an authorization mechanism. Sensitive routes
// additionally check the Origin header and their authenticated session.
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) callback(null, true);
    else if (isAllowedOrigin(origin)) callback(null, true);
    else callback(new Error("CORS error: origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Accept",
    "X-Requested-With",
  ],
};
app.use(cors(corsOptions));

// Static global (sert tout ./public à la racine → /images/... , /articles/...)
// The built frontend takes priority when present: it contains the compiled
// React entry points required by the Navbar and Footer on static article pages.
app.use(express.static(siteDistributionRoot));
app.use(express.static(path.join(__dirname, "public")));
// Dedicated article pages and their media are written to the frontend public
// directory so Vite can publish them in the next site build. Serving it here
// also makes the URLs available when the API is the static-file server.
app.use(express.static(sitePublicRoot));

// ✅ Body parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ✅ Logger HTTP via morgan -> Winston
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// ✅ Compression / Cookies / Upload
// app.use(compression());
app.use(fileUpload());
app.use(cookieParser());

// ✅ Routes API
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/recaptcha", recaptchaRoutes);

// ✅ Test
app.get("/api/test", (req, res) => res.json({ message: "Hello, world of bugs" }));
app.post("/api/test", (req, res) => {
  testNotif()
    .then((result) => {
      if (!result) {
        
        res.json({ message: "erreur sur variable env" });
      }
      res.json({ message: "notif envoyée" });
    })
    .catch((e) => {
      res.json({ message: "error de notif: " + e });
    });
});

logger.info("🚀 app listening ");

// ✅ Middleware global d'erreurs
app.use((err, req, res, next) => {
  logger.error(`Erreur serveur: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    status: err.status || 500,
    body: redactLogData(req.body),
    query: redactLogData(req.query),
  });

  const status = Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({
    error: true,
    message:
      status >= 500
        ? "An unexpected server error occurred."
        : "The request could not be processed.",
    status,
  });
});

module.exports = app;
