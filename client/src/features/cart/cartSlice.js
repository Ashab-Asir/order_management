import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items[product.id];
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items[product.id] = { product, quantity: 1 };
      }
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      if (!state.items[productId]) return;
      if (quantity <= 0) {
        delete state.items[productId];
      } else {
        state.items[productId].quantity = quantity;
      }
    },
    clearCart() {
      return initialState;
    },
  },
});

export const { addToCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartSummary = (state) => {
  const itemsArr = Object.values(state.cart.items);
  let subtotal = 0;
  itemsArr.forEach(({ product, quantity }) => {
    subtotal += Number(product.price) * quantity;
  });
  return {
    items: itemsArr,
    subtotal,
  };
};

export default cartSlice.reducer;
