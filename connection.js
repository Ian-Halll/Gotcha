const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'amongus',
  database: 'employee_trackerDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a connection from the pool
const connection = pool.promise();

module.exports = connection;