import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import promotionReducer from "../features/promotions/promotionSlice";
import orderReducer from "../features/orders/orderSlice";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    promotions: promotionReducer,
    orders: orderReducer,
    cart: cartReducer,
  },
});
