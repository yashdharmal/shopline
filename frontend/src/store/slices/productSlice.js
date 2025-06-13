import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Products
    fetchProductsStart: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Single Product
    fetchProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductSuccess: (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    },
    fetchProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Categories
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;
