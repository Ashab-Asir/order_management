import express from "express";
import Joi from "joi";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import {
  createProduct,
  getAllProducts,
  updateProduct,
} from "../services/productService.js";

const router = express.Router();

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().positive().required(),
  unit_weight_grams: Joi.number().integer().positive().required(),
  is_enabled: Joi.boolean().optional(),
});

// Admin: list all products
router.get(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const products = await getAllProducts({ includeDisabled: true });
      res.json(products);
    } catch (err) {
      next(err);
    }
  }
);

// User: list enabled products
router.get(
  "/",
  authenticate,
  authorizeRoles("USER", "ADMIN"),
  async (req, res, next) => {
    try {
      const products = await getAllProducts({ includeDisabled: false });
      res.json(products);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const { error } = productSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const product = await createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const { error } = productSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      await updateProduct(req.params.id, req.body);
      res.json({ message: "Updated" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
