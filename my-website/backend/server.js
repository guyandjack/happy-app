// Load environment variables first
const dotenv = require("dotenv");
const path = require("path");
// Create HTTP server
const http = require("http");
const winston = require("winston");
const morgan = require("morgan");

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
    new winston.transports.File({ filename: "logs/server.log" }), // Enregistre dans le fichier logs/app.log
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

dotenv.config({ path: path.join(__dirname, ".env") });

// Import app from app.js
const app = require("./app");

//normalise le port
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//creation du serveur
const server = http.createServer(app);
//lancement du serveur
server.listen(port);

/*********************gestion des erreurs*********************
 *
 * start**************/

//fonction qui gère les erreurs de connexion au serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.on("error", errorHandler);

//aider à diagnostiquer des problèmes en affichant le port d'écoute.
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// intercepte les promesses non gérées
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION!  Shutting down... promesse non gérée");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// intercepte les exceptions non gérées
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION!  Shutting down... exception non gérée");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

/*********************gestion des erreurs*********************
 *
 * end**************/
