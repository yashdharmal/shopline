import { createSlice } from "@reduxjs/toolkit";
import { showSuccessToast } from "../../utils/toast";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      // Get the effective price (discounted price if available, otherwise regular price)
      const effectivePrice = parseFloat(
        newItem.discountedPrice || newItem.price
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = effectivePrice * existingItem.quantity;
        showSuccessToast(`Added another ${newItem.name} to cart`);
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: effectivePrice,
        });
        showSuccessToast(`${newItem.name} added to cart`);
      }

      state.totalQuantity += 1;
      state.totalAmount += effectivePrice;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= parseFloat(existingItem.totalPrice);
        state.items = state.items.filter((item) => item.id !== id);
        showSuccessToast("Item removed from cart");
      }
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem && quantity > 0) {
        const quantityDifference = quantity - existingItem.quantity;
        const effectivePrice = parseFloat(
          existingItem.discountedPrice || existingItem.price
        );

        existingItem.quantity = quantity;
        existingItem.totalPrice = effectivePrice * quantity;

        state.totalQuantity += quantityDifference;
        state.totalAmount += effectivePrice * quantityDifference;
        showSuccessToast("Cart updated");
      }
    },

    clearCart: (state, action) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      if (!action.payload?.silent) {
        showSuccessToast("Cart cleared");
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
