import { pool } from "../config/db.js";
import {
  getActivePromotions,
  getSlabsByPromotion,
  calculateWeightedDiscount,
} from "./promotionService.js";
import { getProductById } from "./productService.js";

// shared logic for both preview and create
export const computeOrderPricing = async (items) => {

  const activePromos = await getActivePromotions();

  let subtotal = 0;
  let totalDiscount = 0;

  const orderLines = [];
  const promoDiscountMap = {}; 

  for (const item of items) {
    const product = await getProductById(item.productId);
    if (!product || !product.is_enabled)
      throw { status: 400, message: "Invalid product in cart" };

    const unitPrice = Number(product.price);
    const quantity = item.quantity;
    const lineSub = unitPrice * quantity;
    subtotal += lineSub;

    const totalWeightKg = (product.unit_weight_grams * quantity) / 1000.0;

    let lineDiscount = 0;

    for (const promo of activePromos) {
      let thisPromoDiscount = 0;

      if (promo.type === "PERCENTAGE") {
        thisPromoDiscount = (lineSub * Number(promo.value)) / 100;
      } else if (promo.type === "FIXED") {
        thisPromoDiscount = Number(promo.value) * quantity;
      } else if (promo.type === "WEIGHTED") {
        const slabs = await getSlabsByPromotion(promo.id);
        thisPromoDiscount = calculateWeightedDiscount(
          slabs,
          totalWeightKg,
          quantity
        );
      }

      if (thisPromoDiscount > 0) {
        lineDiscount += thisPromoDiscount;

        if (!promoDiscountMap[promo.id]) {
          promoDiscountMap[promo.id] = {
            id: promo.id,
            title: promo.title,
            type: promo.type,
            totalDiscount: 0,
          };
        }
        promoDiscountMap[promo.id].totalDiscount += thisPromoDiscount;
      }
    }

    totalDiscount += lineDiscount;
    const lineTotal = lineSub - lineDiscount;

    orderLines.push({
      product_id: product.id,
      name: product.name,
      quantity,
      unit_price: unitPrice,
      discount_amount: lineDiscount,
      line_total: lineTotal,
    });
  }

  const grandTotal = subtotal - totalDiscount;
  const appliedPromotions = Object.values(promoDiscountMap);

  return {
    subtotal,
    totalDiscount,
    grandTotal,
    items: orderLines,
    appliedPromotions,
  };
};

export const previewOrder = async (items) => {
  return computeOrderPricing(items);
};

export const createOrder = async (userId, items) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const pricing = await computeOrderPricing(items);
    const { subtotal, totalDiscount, grandTotal, items: orderLines } = pricing;

    const [orderRes] = await conn.query(
      `INSERT INTO orders (user_id, subtotal, total_discount, grand_total)
       VALUES (?,?,?,?)`,
      [userId, subtotal, totalDiscount, grandTotal]
    );

    const orderId = orderRes.insertId;

    const values = orderLines.map((l) => [
      orderId,
      l.product_id,
      l.quantity,
      l.unit_price,
      l.discount_amount,
      l.line_total,
    ]);

    await conn.query(
      `INSERT INTO order_items
       (order_id, product_id, quantity, unit_price, discount_amount, line_total)
       VALUES ?`,
      [values]
    );

    await conn.commit();

    return { id: orderId, ...pricing };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getOrdersForUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

export const getAllOrders = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );
  return rows;
};
