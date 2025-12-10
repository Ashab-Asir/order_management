import { pool } from "../config/db.js";

export const getAllProducts = async ({ includeDisabled = false }) => {
  const where = includeDisabled ? "" : "WHERE is_enabled = TRUE";
  const [rows] = await pool.query(`SELECT * FROM products ${where}`);
  return rows;
};

export const createProduct = async (product) => {
  const { name, description, price, unit_weight_grams } = product;
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, unit_weight_grams)
     VALUES (?,?,?,?)`,
    [name, description, price, unit_weight_grams]
  );
  return { id: result.insertId, ...product, is_enabled: 1 };
};

export const updateProduct = async (id, data) => {
  await pool.query(
    `UPDATE products SET name=?, description=?, price=?, unit_weight_grams=?, is_enabled=?
     WHERE id=?`,
    [
      data.name,
      data.description,
      data.price,
      data.unit_weight_grams,
      data.is_enabled,
      id,
    ]
  );
};

export const getProductById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};
