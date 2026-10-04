const requiredEnv = [
  "DATABASE_URL",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

export const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (process.env.JWT_SECRET.trim().length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }
};
