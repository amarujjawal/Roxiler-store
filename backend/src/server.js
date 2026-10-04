import dotenv from "dotenv";
import app from "./app.js";
import { ensureSchema, query } from "./config/db.js";
import { validateEnv } from "./config/env.js";
import { seedAdmin } from "./seedAdmin.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

const start = async () => {
  try {
    validateEnv();
    await query("SELECT 1");
    await ensureSchema();
    await seedAdmin();

    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

start();
