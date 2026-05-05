import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '1234',
  database: process.env.MYSQL_DB || 'Hotel_Management_System',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
