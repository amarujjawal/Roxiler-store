import bcrypt from "bcryptjs";
import { query } from "../config/db.js";
import {
  emailRegex,
  passwordRegex,
  validateAddress,
  validateName,
  validateRequiredString,
} from "../validators/common.js";

const sortMapUsers = {
  name: "u.name",
  email: "u.email",
  address: "u.address",
  role: "u.role",
  createdAt: "u.created_at",
};

const sortMapStores = {
  name: "s.name",
  email: "s.email",
  address: "s.address",
  rating: "average_rating",
};

const getDirection = (value) =>
  value?.toLowerCase() === "desc" ? "DESC" : "ASC";

export const dashboard = async (req, res) => {
  const [users, stores, ratings] = await Promise.all([
    query("SELECT COUNT(*)::int AS count FROM users"),
    query("SELECT COUNT(*)::int AS count FROM stores"),
    query("SELECT COUNT(*)::int AS count FROM ratings"),
  ]);

  res.json({
    users: users.rows[0].count,
    stores: stores.rows[0].count,
    ratings: ratings.rows[0].count,
  });
};

export const listUsers = async (req, res) => {
  const {
    name = "",
    email = "",
    address = "",
    role = "",
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;

  const sort = sortMapUsers[sortBy] || "u.name";
  const direction = getDirection(sortOrder);

  const result = await query(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.address,
       u.role,
       u.created_at AS "createdAt",
       CASE
         WHEN u.role = 'OWNER' THEN ROUND(COALESCE(AVG(r.rating), 0), 2)
         ELSE NULL
       END AS rating
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE u.name ILIKE $1
       AND u.email ILIKE $2
       AND u.address ILIKE $3
       AND ($4 = '' OR u.role = $4)
     GROUP BY u.id
     ORDER BY ${sort} ${direction}`,
    [`%${name}%`, `%${email}%`, `%${address}%`, role]
  );

  res.json({ users: result.rows });
};

export const getUser = async (req, res) => {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const result = await query(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.address,
       u.role,
       CASE
         WHEN u.role = 'OWNER' THEN ROUND(COALESCE(AVG(r.rating), 0), 2)
         ELSE NULL
       END AS rating
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [userId]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user: result.rows[0] });
};

export const createUser = async (req, res) => {
  const { name, email, password, address, role = "USER" } = req.body;

  if (!validateName(name)) {
    return res.status(400).json({ message: "Name must be 5-60 characters" });
  }

  if (!emailRegex.test(email || "")) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!validateAddress(address)) {
    return res.status(400).json({ message: "Address must be 1-400 characters" });
  }

  if (!passwordRegex.test(password || "")) {
    return res.status(400).json({
      message:
        "Password must be 8-16 chars with uppercase and special character",
    });
  }

  if (!["ADMIN", "USER", "OWNER"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const hash = await bcrypt.hash(password, 12);

  const result = await query(
    `INSERT INTO users(name, email, password, address, role)
     VALUES($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role`,
    [name.trim(), normalizedEmail, hash, address.trim(), role]
  );

  res.status(201).json({ user: result.rows[0] });
};

export const createStore = async (req, res) => {
  const { name, email, address, ownerId = null } = req.body;

  if (!validateRequiredString(name, 255)) {
    return res.status(400).json({ message: "Store name is required" });
  }

  if (!emailRegex.test(email || "")) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!validateAddress(address)) {
    return res.status(400).json({ message: "Address must be 1-400 characters" });
  }

  const normalizedOwnerId =
    ownerId === null || ownerId === "" ? null : Number(ownerId);

  if (
    normalizedOwnerId !== null &&
    (!Number.isInteger(normalizedOwnerId) || normalizedOwnerId < 1)
  ) {
    return res.status(400).json({ message: "Invalid ownerId" });
  }

  if (normalizedOwnerId !== null) {
    const owner = await query(
      "SELECT id, role FROM users WHERE id = $1",
      [normalizedOwnerId]
    );

    if (!owner.rows[0] || owner.rows[0].role !== "OWNER") {
      return res
        .status(400)
        .json({ message: "ownerId must belong to a Store Owner" });
    }
  }

  const result = await query(
    `INSERT INTO stores(name, email, address, owner_id)
     VALUES($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id`,
    [name.trim(), email.trim().toLowerCase(), address.trim(), normalizedOwnerId]
  );

  res.status(201).json({ store: result.rows[0] });
};

export const listStores = async (req, res) => {
  const {
    name = "",
    email = "",
    address = "",
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;

  const sort = sortMapStores[sortBy] || "s.name";
  const direction = getDirection(sortOrder);

  const result = await query(
    `SELECT
       s.id,
       s.name,
       s.email,
       s.address,
       s.owner_id AS "ownerId",
       ROUND(COALESCE(AVG(r.rating), 0), 2) AS average_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.name ILIKE $1
       AND s.email ILIKE $2
       AND s.address ILIKE $3
     GROUP BY s.id
     ORDER BY ${sort} ${direction}`,
    [`%${name}%`, `%${email}%`, `%${address}%`]
  );

  res.json({ stores: result.rows });
};
