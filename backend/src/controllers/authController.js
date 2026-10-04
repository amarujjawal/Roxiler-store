import bcrypt from "bcryptjs";
import { query } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import {
  emailRegex,
  passwordRegex,
  validateAddress,
  validateName,
} from "../validators/common.js";

export const signup = async (req, res) => {
  const { name, email, address, password } = req.body;

  if (!validateName(name)) {
    return res.status(400).json({ message: "Name must be 5-60 characters" });
  }

  if (!emailRegex.test(email || "")) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!validateAddress(address)) {
    return res
      .status(400)
      .json({ message: "Address must be 1-400 characters" });
  }

  if (!passwordRegex.test(password || "")) {
    return res.status(400).json({
      message:
        "Password must be 8-16 characters with at least one uppercase letter and one special character",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await query("SELECT id FROM users WHERE email = $1", [
    normalizedEmail,
  ]);

  if (existing.rows.length) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hash = await bcrypt.hash(password, 12);

  const result = await query(
    `INSERT INTO users(name, email, password, address, role)
     VALUES($1, $2, $3, $4, 'USER')
     RETURNING id, name, email, address, role`,
    [name.trim(), normalizedEmail, hash, address.trim()]
  );

  const user = result.rows[0];

  res.status(201).json({
    token: signToken({ id: user.id, role: user.role }),
    user,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!emailRegex.test(normalizedEmail) || typeof password !== "string") {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const result = await query("SELECT * FROM users WHERE email = $1", [
    normalizedEmail,
  ]);

  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };

  res.json({
    token: signToken({ id: user.id, role: user.role }),
    user: safeUser,
  });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
