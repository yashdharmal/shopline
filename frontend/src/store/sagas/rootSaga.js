import { all } from "redux-saga/effects";
import { watchProductSagas } from "./productSaga";
import { watchOrderSagas } from "./orderSaga";

export function* watcherSaga() {
  yield all([watchProductSagas(), watchOrderSagas()]);
}
