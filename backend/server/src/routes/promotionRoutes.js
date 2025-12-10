import express from "express";
import Joi from "joi";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import {
  createPromotion,
  getActivePromotions,
  getAllPromotions,
  getSlabsByPromotion,
  updatePromotionBasic,
  setPromotionEnabled,
} from "../services/promotionService.js";

const router = express.Router();

const promotionCreateSchema = Joi.object({
  title: Joi.string().required(),
  type: Joi.string().valid("PERCENTAGE", "FIXED", "WEIGHTED").required(),
  value: Joi.number().optional().allow(null),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  is_enabled: Joi.boolean().optional(),
  slabs: Joi.array()
    .items(
      Joi.object({
        min_weight_kg: Joi.number().required(),
        max_weight_kg: Joi.number().allow(null),
        discount_per_unit: Joi.number().required(),
      })
    )
    .optional(),
});

// only title, dates, enabled can be edited later
const promotionUpdateSchema = Joi.object({
  title: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  is_enabled: Joi.boolean().required(),
});

// create promotion
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const { error } = promotionCreateSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const { slabs, ...promo } = req.body;
      const created = await createPromotion(promo, slabs || []);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }
);

// list all promotions
router.get(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const promos = await getAllPromotions();
      res.json(promos);
    } catch (err) {
      next(err);
    }
  }
);

// Admin: list active promotions
router.get(
  "/active",
  authenticate,
  authorizeRoles("USER", "ADMIN"),
  async (req, res, next) => {
    try {
      const promos = await getActivePromotions();
      res.json(promos);
    } catch (err) {
      next(err);
    }
  }
);

// Admin – edit title, dates, enabled
router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const { error } = promotionUpdateSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      await updatePromotionBasic(req.params.id, req.body);
      res.json({ message: "Promotion updated" });
    } catch (err) {
      next(err);
    }
  }
);

// Admin – enable/disable
router.patch(
  "/:id/enabled",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const schema = Joi.object({
        is_enabled: Joi.boolean().required(),
      });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      await setPromotionEnabled(req.params.id, req.body.is_enabled);
      res.json({ message: "Promotion status updated" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
