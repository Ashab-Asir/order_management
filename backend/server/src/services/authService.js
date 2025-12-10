import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const registerUser = async ({
  name,
  email,
  password,
  role = "USER",
}) => {
  const [roleRow] = await pool.query("SELECT id FROM roles WHERE name = ?", [
    role,
  ]);
  if (!roleRow[0]) throw { status: 400, message: "Invalid role" };

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await pool.query(
    "INSERT INTO users (name, email, password_hash, role_id) VALUES (?,?,?,?)",
    [name, email, hash, roleRow[0].id]
  );
};

export const loginUser = async ({ email, password }) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.password_hash, r.name as role
     FROM users u JOIN roles r ON u.role_id = r.id
     WHERE email = ?`,
    [email]
  );
  if (!rows[0]) throw { status: 400, message: "Invalid credentials" };

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 400, message: "Invalid credentials" };

  const payload = { id: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
    refreshToken,
    user.id,
  ]);

  return {
    user: { id: user.id, role: user.role, email },
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (token) => {
  const payload = verifyRefreshToken(token);
  const [rows] = await pool.query(
    "SELECT refresh_token FROM users WHERE id = ?",
    [payload.id]
  );
  if (!rows[0] || rows[0].refresh_token !== token)
    throw { status: 401, message: "Invalid refresh token" };

  const newPayload = { id: payload.id, role: payload.role };
  const accessToken = generateAccessToken(newPayload);
  const refreshToken = generateRefreshToken(newPayload);

  await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
    refreshToken,
    payload.id,
  ]);

  return { accessToken, refreshToken };
};
