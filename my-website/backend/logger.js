const winston = require("winston");
const path = require("path");

// Création du logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join("logs", "app.log"),
      format: winston.format.json(),
    }),
  ],
});

// Formateur pour les arguments
function formatArg(arg) {
  if (typeof arg === "object") {
    try {
      return JSON.stringify(arg);
    } catch (e) {
      return "[Circular]";
    }
  }
  return String(arg);
}

// Rediriger console.log, warn, error
console.log = (...args) => {
  logger.info(args.map(formatArg).join(" "));
};

console.warn = (...args) => {
  logger.warn(args.map(formatArg).join(" "));
};

console.error = (...args) => {
  logger.error(args.map(formatArg).join(" "));
};

module.exports = logger;
