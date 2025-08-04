// middleware/cors.middleware.js
const cors = require("cors");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:4173",
      "http://localhost:5173",
      "https://helveclick.ch",
      "https://happy-api-hd3g.onrender.com",
    ];

    // Autorise les requêtes sans origin (curl, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Gère les erreurs proprement
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
};

module.exports = cors(corsOptions);
