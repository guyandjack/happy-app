const mysql = require('mysql2/promise');

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to get a connection from the pool
const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established');
    return connection;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

// Function to release a connection back to the pool
const releaseConnection = (connection) => {
  if (connection) {
    connection.release();
    console.log('Database connection released');
  }
};

module.exports = {
  getConnection,
  releaseConnection
}; 