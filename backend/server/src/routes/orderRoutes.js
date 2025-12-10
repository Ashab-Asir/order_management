import express from "express";
import Joi from "joi";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import {
  createOrder,
  getAllOrders,
  getOrdersForUser,
  previewOrder,
} from "../services/orderService.js";

const router = express.Router();

const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

// order pricing without saving
router.post(
  "/preview",
  authenticate,
  authorizeRoles("USER", "ADMIN"),
  async (req, res, next) => {
    try {
      const { error } = orderSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const summary = await previewOrder(req.body.items);
      res.json(summary);
    } catch (err) {
      next(err);
    }
  }
);

// User: create order
router.post(
  "/",
  authenticate,
  authorizeRoles("USER", "ADMIN"),
  async (req, res, next) => {
    try {
      const { error } = orderSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const order = await createOrder(req.user.id, req.body.items);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }
);

// User: own orders
router.get(
  "/me",
  authenticate,
  authorizeRoles("USER", "ADMIN"),
  async (req, res, next) => {
    try {
      const orders = await getOrdersForUser(req.user.id);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  }
);

// Admin: all orders
router.get(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const orders = await getAllOrders();
      res.json(orders);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
