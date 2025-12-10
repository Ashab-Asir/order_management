import { pool } from "../config/db.js";

export const createPromotion = async (promo, slabs = []) => {
  const { title, type, value, start_date, end_date, is_enabled = true } = promo;

  const [res] = await pool.query(
    `INSERT INTO promotions (title, type, value, start_date, end_date, is_enabled)
     VALUES (?,?,?,?,?,?)`,
    [title, type, value, start_date, end_date, is_enabled]
  );
  const promoId = res.insertId;

  if (type === "WEIGHTED" && slabs.length) {
    const values = slabs.map((s) => [
      promoId,
      s.min_weight_kg,
      s.max_weight_kg ?? null,
      s.discount_per_unit,
    ]);
    await pool.query(
      `INSERT INTO promotion_slabs
        (promotion_id, min_weight_kg, max_weight_kg, discount_per_unit)
       VALUES ?`,
      [values]
    );
  }

  return { id: promoId, ...promo };
};

export const getActivePromotions = async (now = new Date()) => {
  const [rows] = await pool.query(
    `SELECT * FROM promotions
     WHERE is_enabled = TRUE
       AND start_date <= ?
       AND end_date >= ?`,
    [now, now]
  );
  return rows;
};

export const getAllPromotions = async () => {
  const [rows] = await pool.query(`SELECT * FROM promotions`);
  return rows;
};

export const getSlabsByPromotion = async (promotionId) => {
  const [rows] = await pool.query(
    `SELECT * FROM promotion_slabs
     WHERE promotion_id = ?
     ORDER BY min_weight_kg ASC`,
    [promotionId]
  );
  return rows;
};

// For weighted discount
export const calculateWeightedDiscount = (slabs, totalWeightKg, quantity) => {
  const slab = slabs.find((s) => {
    const min = Number(s.min_weight_kg);
    const max = s.max_weight_kg !== null ? Number(s.max_weight_kg) : Infinity;
    return totalWeightKg >= min && totalWeightKg <= max;
  });
  if (!slab) return 0;
  return Number(slab.discount_per_unit) * quantity; // per 500g unit * qty
};

// update basic fields (title, dates, enabled)
export const updatePromotionBasic = async (
  id,
  { title, start_date, end_date, is_enabled }
) => {
  await pool.query(
    `UPDATE promotions
     SET title = ?, start_date = ?, end_date = ?, is_enabled = ?
     WHERE id = ?`,
    [title, start_date, end_date, is_enabled, id]
  );
};

// enable/disable only
export const setPromotionEnabled = async (id, is_enabled) => {
  await pool.query(`UPDATE promotions SET is_enabled = ? WHERE id = ?`, [
    is_enabled,
    id,
  ]);
};
