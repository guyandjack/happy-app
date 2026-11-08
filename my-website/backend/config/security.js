const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  "https://helveclick.ch",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
];

const allowedOrigins = [...new Set([
  ...defaultOrigins,
  process.env.FRONTEND_URL,
  ...configuredOrigins,
].filter(Boolean))];

const isAllowedOrigin = (origin) => allowedOrigins.includes(origin);

module.exports = {
  allowedOrigins,
  isAllowedOrigin,
};
