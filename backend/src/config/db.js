import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, "../../../database/schema.sql");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

export const query = (text, params) => pool.query(text, params);

export const ensureSchema = async () => {
  try {
    const result = await query(`SELECT to_regclass('public.users') AS users_table`);

    if (result.rows[0]?.users_table) {
      return;
    }

    const schemaSql = await fs.readFile(schemaPath, "utf8");
    await query(schemaSql);
    console.log("Database schema initialized successfully.");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(`Schema file not found at ${schemaPath}`);
      return;
    }

    console.error("Schema initialization failed:", error.message);
    throw error;
  }
};
