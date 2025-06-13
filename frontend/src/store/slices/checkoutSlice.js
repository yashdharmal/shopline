import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCheckoutActive: false,
  customerDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  },
  shippingMethod: "standard", // standard or express
  errors: {},
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    startCheckout: (state) => {
      state.isCheckoutActive = true;
    },
    cancelCheckout: (state) => {
      state.isCheckoutActive = false;
      state.customerDetails = initialState.customerDetails;
      state.errors = {};
    },
    updateCustomerDetails: (state, action) => {
      state.customerDetails = {
        ...state.customerDetails,
        ...action.payload,
      };
    },
    setShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    clearErrors: (state) => {
      state.errors = {};
    },
  },
});

export const {
  startCheckout,
  cancelCheckout,
  updateCustomerDetails,
  setShippingMethod,
  setErrors,
  clearErrors,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
