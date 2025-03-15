// Load environment variables first
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

// Import app from app.js
const app = require('./app');

// Create HTTP server
const http = require("http");


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
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// intercepte les exceptions non gérées
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});


/*********************gestion des erreurs*********************
 * 
 * end**************/




