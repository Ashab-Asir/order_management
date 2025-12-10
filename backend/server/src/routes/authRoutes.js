import express from "express";
import Joi from "joi";
import {
  loginUser,
  refreshTokens,
  registerUser,
} from "../services/authService.js";

const router = express.Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signupSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// signup as normal USER
router.post("/register-user", async (req, res, next) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    await registerUser({ ...req.body, role: "USER" });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // duplicate email, etc.
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }
    next(err);
  }
});

// signup as ADMIN but needs secret code from .env
router.post("/register-admin", async (req, res, next) => {
  try {
    const { adminSecret, ...userData } = req.body;

    if (!adminSecret || adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }

    const { error } = signupSchema.validate(userData);
    if (error) return res.status(400).json({ message: error.message });

    await registerUser({ ...userData, role: "ADMIN" });
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }
    next(err);
  }
});

// Login 
router.post("/login", async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const data = await loginUser(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Refresh tokens
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const data = await refreshTokens(refreshToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
