import { call, put, takeEvery } from "redux-saga/effects";
import { orderAPI } from "../../services/api";
import {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
} from "../slices/orderSlice";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

// Worker Sagas
function* createOrderSaga(action) {
  try {
    const response = yield call(orderAPI.create, action.payload);
    if (response.data.success) {
      // Calculate total amount from items
      const totalAmount = action.payload.items.reduce((sum, item) => {
        return sum + item.price * (item.quantity || 1);
      }, 0);

      const order = {
        ...response.data.data.order,
        items: action.payload.items,
        totalAmount: parseFloat(totalAmount.toFixed(2)), // Ensure it's a number with 2 decimal places
      };
      yield put(createOrderSuccess(order));
      showSuccessToast("Order placed successfully!");
    } else {
      const errorMessage = response.data.error || "Failed to create order";
      yield put(createOrderFailure(errorMessage));
      showErrorToast(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.message || "Failed to create order";
    yield put(createOrderFailure(errorMessage));
    showErrorToast(errorMessage);
  }
}

function* fetchOrdersSaga() {
  try {
    const response = yield call(orderAPI.getAll);
    if (response.data.success) {
      // Ensure all orders have totalAmount as a number
      const orders = response.data.data.map((order) => ({
        ...order,
        totalAmount: parseFloat((order.totalAmount || 0).toFixed(2)),
      }));
      yield put(fetchOrdersSuccess(orders));
    } else {
      yield put(
        fetchOrdersFailure(response.data.error || "Failed to fetch orders")
      );
      showErrorToast(response.data.error || "Failed to fetch orders");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    yield put(fetchOrdersFailure(errorMessage));
    showErrorToast(errorMessage);
  }
}

// Watcher Saga
export function* watchOrderSagas() {
  yield takeEvery(createOrderStart.type, createOrderSaga);
  yield takeEvery(fetchOrdersStart.type, fetchOrdersSaga);
}
