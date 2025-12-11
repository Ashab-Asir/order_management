# Order Management

A lightweight full-stack Order Management app with smart promotions and smooth checkout.

- Frontend: React (Vite) + Tailwind CSS + Redux Toolkit  
- Backend: Node.js + Express + MySQL (mysql2/promise)  
- Auth: JWT access + refresh tokens (token rotation stored in DB)  
- Promotions: Percentage, Fixed per-item, and Weighted slabs by weight ranges

---

## Features
- User signup/login (USER / ADMIN roles)
- Admin product management (create / edit / enable / disable)
- Admin promotions with 3 types: `PERCENTAGE`, `FIXED`, `WEIGHTED (slabs)`
- Cart + real-time order preview (`POST /api/orders/preview`) using same backend pricing logic
- Transactional order creation (`orders` + `order_items`)
- Token refresh flow via `POST /api/auth/refresh` and client-side axios interceptor
- Clean Tailwind-based UI, framer-motion for small animations

---



## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MySQL server
- (optional) Git

---

## Environment Variables

### 1. Server Configuration
Create a file named `.env` in the **`server`** folder and add the following:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=order_management_db

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

ADMIN_REGISTRATION_SECRET=some_admin_code
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```
---

## SQL schema (run on your MySQL server)

Create database and tables (example SQL). Save as `schema.sql` and run with `mysql -u root -p < schema.sql` or run commands in a MySQL client.

```sql
-- create database
CREATE DATABASE IF NOT EXISTS order_management_db;
USE order_management_db;

-- roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32) NOT NULL UNIQUE
);

-- users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  refresh_token TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  unit_weight_grams INT NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- promotions
CREATE TABLE IF NOT EXISTS promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('PERCENTAGE','FIXED','WEIGHTED') NOT NULL,
  value DECIMAL(10,4) DEFAULT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- promotion slabs
CREATE TABLE IF NOT EXISTS promotion_slabs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  promotion_id INT NOT NULL,
  min_weight_kg DECIMAL(8,3) NOT NULL,
  max_weight_kg DECIMAL(8,3) DEFAULT NULL,
  discount_per_unit DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE
);

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  total_discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  grand_total DECIMAL(12,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- order items
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  line_total DECIMAL(12,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- seed roles
INSERT INTO roles (name) VALUES ('USER'), ('ADMIN');

USE order_management_db;

INSERT INTO products (name, description, price, unit_weight_grams, is_enabled)
VALUES
('Milk', 'Milk is very testy', 50.00, 1000, 1),
('Rice', 'is very important', 150.00, 500, 1);

-- sample percentage promotion
INSERT INTO promotions (title, type, value, start_date, end_date, is_enabled)
VALUES ('New Year 12%', 'PERCENTAGE', 12.0, '2025-12-01 00:00:00', '2026-01-01 00:00:00', 1);

-- sample weighted promotion
INSERT INTO promotions (title, type, value, start_date, end_date, is_enabled)
VALUES ('Weight Discount', 'WEIGHTED', NULL, '2025-12-01 00:00:00', '2025-12-31 23:59:59', 1);

SET @promo_id = LAST_INSERT_ID();
INSERT INTO promotion_slabs (promotion_id, min_weight_kg, max_weight_kg, discount_per_unit)
VALUES (@promo_id, 0.0, 1.0, 5.00), (@promo_id, 1.001, NULL, 10.00);

```
---

## Backend — install & run

1.  **Open terminal** → `server` directory

    ```bash
    cd server
    npm install
    ```

2.  **Configure Environment**
    Create a `.env` file as shown previously.

3.  **Database Setup**
    Ensure your DB is created and run `schema.sql` to create the necessary tables.

4.  **Start the server (dev)**

    ```bash
    npm run dev
    ```

    *Server will run at `http://localhost:5000` (API base `http://localhost:5000/api`).*

---

## Frontend — install & run

1.  **Open new terminal** → `client` folder

    ```bash
    cd client
    npm install
    ```

2.  **Configure Environment**
    Create a `.env` file in the `client` directory with the following content:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

3.  **Start dev server**

    ```bash
    npm run dev
    ```

    *Open `http://localhost:5173` to view the application.*
