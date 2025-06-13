import { call, put, takeEvery } from "redux-saga/effects";
import { productAPI, categoryAPI } from "../../services/api";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} from "../slices/productSlice";

// Worker Sagas
function* fetchProductsSaga(action) {
  try {
    const params = action.payload?.categoryId
      ? { category: action.payload.categoryId }
      : {};
    const response = yield call(productAPI.getAll, params);
    yield put(fetchProductsSuccess(response.data.data));
  } catch (error) {
    yield put(fetchProductsFailure(error.message));
  }
}

function* fetchProductSaga(action) {
  try {
    const response = yield call(productAPI.getById, action.payload);
    yield put(fetchProductSuccess(response.data.data));
  } catch (error) {
    yield put(fetchProductFailure(error.message));
  }
}

function* fetchCategoriesSaga() {
  try {
    const response = yield call(categoryAPI.getAll);
    yield put(fetchCategoriesSuccess(response.data.data));
  } catch (error) {
    yield put(fetchCategoriesFailure(error.message));
  }
}

// Watcher Saga
export function* watchProductSagas() {
  yield takeEvery(fetchProductsStart.type, fetchProductsSaga);
  yield takeEvery(fetchProductStart.type, fetchProductSaga);
  yield takeEvery(fetchCategoriesStart.type, fetchCategoriesSaga);
}
