// Load environment variables
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

// Logger Winston
const logger = require("./logger");

// Core modules
const http = require("http");

// Logging HTTP requests
const morgan = require("morgan");

// App Express
const app = require("./app");

// Logger HTTP avec Winston (stream)
app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Normalise le port
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Création du serveur HTTP
const server = http.createServer(app);

// Lancement du serveur
server.listen(port);

// Gestion des erreurs de démarrage serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") throw error;

  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  let message = "";

  switch (error.code) {
    case "EACCES":
      message = `${bind} requires elevated privileges.`;
      break;
    case "EADDRINUSE":
      message = `${bind} is already in use.`;
      break;
    default:
      throw error;
  }

  logger.error(`🛑 Server error: ${message}`);
  process.exit(1);
};

server.on("error", errorHandler);

// Affiche le port utilisé dans les logs
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  logger.info("🚀 Server listening on " + bind);
});

// Capture des promesses non gérées
process.on("unhandledRejection", (reason, promise) => {
  logger.error("💥 Unhandled Rejection", {
    promise,
    reason: reason instanceof Error ? reason.message : reason,
  });
  server.close(() => {
    process.exit(1);
  });
});

// Capture des exceptions non attrapées
process.on("uncaughtException", (err) => {
  logger.error(`🔥 Uncaught Exception: ${err.message}`, { stack: err.stack });
  server.close(() => {
    process.exit(1);
  });
});
