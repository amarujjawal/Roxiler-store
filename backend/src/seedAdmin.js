import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query, pool } from "./config/db.js";
import { validateEnv } from "./config/env.js";
import { emailRegex, passwordRegex } from "./validators/common.js";

dotenv.config();

export const seedAdmin = async () => {
  validateEnv();

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!emailRegex.test(email)) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }

  if (!passwordRegex.test(plainPassword)) {
    throw new Error(
      "ADMIN_PASSWORD must be 8-16 characters with an uppercase letter and a special character."
    );
  }

  const existing = await query("SELECT role FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) {
    if (existing.rows[0].role !== "ADMIN") {
      throw new Error("ADMIN_EMAIL is already registered to a non-admin user.");
    }

    console.log("Configured admin already exists; leaving it unchanged.");
    return;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 12);
  const result = await query(
    `INSERT INTO users(name, email, password, address, role)
     VALUES($1, $2, $3, $4, 'ADMIN')
     ON CONFLICT(email) DO NOTHING
     RETURNING id`,
    [
      "Roxiler System Administrator",
      email,
      passwordHash,
      "Roxiler Headquarters, India",
    ]
  );

  if (result.rows.length > 0) {
    console.log("Configured admin created successfully.");
  } else {
    const conflict = await query("SELECT role FROM users WHERE email = $1", [email]);
    if (conflict.rows[0]?.role !== "ADMIN") {
      throw new Error("ADMIN_EMAIL is already registered to a non-admin user.");
    }
    console.log("Configured admin already exists; leaving it unchanged.");
  }
};

const invokedPath = process.argv[1] && path.resolve(process.argv[1]);
if (invokedPath === fileURLToPath(import.meta.url)) {
  seedAdmin()
    .catch((error) => {
      console.error("Admin seed failed:", error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      await pool.end();
    });
}
