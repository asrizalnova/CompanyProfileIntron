import "server-only";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL belum diatur di file .env");
}

const databaseConfig = new URL(databaseUrl);

const globalForDb = globalThis as unknown as {
  __mysqlPool?: mysql.Pool;
};

function connect() {
  return mysql.createPool({
    host: databaseConfig.hostname,
    port: Number(databaseConfig.port || 3306),
    user: decodeURIComponent(databaseConfig.username),
    password: decodeURIComponent(databaseConfig.password),
    database: databaseConfig.pathname.replace(/^\//, ""),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export const db = globalForDb.__mysqlPool ?? connect();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mysqlPool = db;
}
