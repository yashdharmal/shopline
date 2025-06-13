import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isActive: false,
  product: null,
};

const buyNowSlice = createSlice({
  name: "buyNow",
  initialState,
  reducers: {
    setBuyNowProduct: (state, action) => {
      state.isActive = true;
      state.product = action.payload;
    },
    clearBuyNowProduct: (state) => {
      state.isActive = false;
      state.product = null;
    },
  },
});

export const { setBuyNowProduct, clearBuyNowProduct } = buyNowSlice.actions;
export default buyNowSlice.reducer;
