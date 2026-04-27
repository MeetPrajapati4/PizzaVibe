import mysql from "mysql2/promise";
import { env } from "../config/env.js";

let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password,
      database: env.mysql.database,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
      decimalNumbers: true
    });
  }

  return pool;
}

export async function createServerConnection() {
  return mysql.createConnection({
    host: env.mysql.host,
    port: env.mysql.port,
    user: env.mysql.user,
    password: env.mysql.password,
    multipleStatements: false
  });
}
