# Order Management System

A full-stack application to manage users, products, promotions, and orders with secure authentication and role-based access.

---

## Tech Stack
**Frontend:** React, Redux Toolkit, Tailwind CSS, Axios  
**Backend:** Node.js (Express), MySQL2, JWT, Joi Validation

---

## Core Features
### Authentication
- User & Admin signup/login  
- Access + Refresh tokens  
- Admin access secured with secret code  

### Product Management
- Admin: Create, update, view all  
- User: View and place order only enabled products  

### Promotions Engine
Supports:
- Percentage discount  
- Fixed unit discount  
- Weight-based slab discount  

### Orders
- Preview pricing before placing  
- Create order in DB with transaction safety  
- User: View own orders  
- Admin: View all orders  


