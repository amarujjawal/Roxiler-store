import bcrypt from "bcryptjs";
import { query } from "../config/db.js";
import { passwordRegex } from "../validators/common.js";

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (typeof currentPassword !== "string") {
    return res.status(400).json({ message: "Current password is required" });
  }

  if (!passwordRegex.test(newPassword || "")) {
    return res.status(400).json({
      message:
        "New password must be 8-16 characters with uppercase and special character",
    });
  }

  const result = await query("SELECT password FROM users WHERE id = $1", [
    req.user.id,
  ]);

  if (!result.rows[0]) {
    return res.status(401).json({ message: "User no longer exists" });
  }

  if (!(await bcrypt.compare(currentPassword, result.rows[0].password))) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  const hash = await bcrypt.hash(newPassword, 12);

  await query(
    "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
    [hash, req.user.id]
  );

  res.json({ message: "Password updated successfully" });
};
