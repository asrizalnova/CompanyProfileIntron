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
    connectionLimit: 5, // Batasi maksimum koneksi per instance agar aman untuk Aiven free tier
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

// Simpan pool ke globalThis tanpa membatasi environment agar tidak membuat pool baru terus-menerus di Vercel
export const db = globalForDb.__mysqlPool ?? connect();

if (typeof window === "undefined") {
  globalForDb.__mysqlPool = db;
}
