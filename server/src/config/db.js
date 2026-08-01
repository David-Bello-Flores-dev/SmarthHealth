import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexiones: reutiliza conexiones en vez de abrir una nueva por query.
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // Azure requiere SSL en la conexión; rejectUnauthorized: false permite
  // funcionar tanto en local como en Azure.
  //ssl: {
    //rejectUnauthorized: false,
  //},
  multipleStatements: true,
});