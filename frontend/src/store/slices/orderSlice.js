import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Create Order
    createOrderStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentOrder = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.orders.push(action.payload);
      state.error = null;
    },
    createOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentOrder = null;
    },

    // Fetch Orders
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  clearCurrentOrder,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;
