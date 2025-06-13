import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { watcherSaga } from "./sagas/rootSaga";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import buyNowReducer from "./slices/buyNowSlice";
import checkoutReducer from "./slices/checkoutSlice";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    buyNow: buyNowReducer,
    checkout: checkoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(watcherSaga);

export default store;
