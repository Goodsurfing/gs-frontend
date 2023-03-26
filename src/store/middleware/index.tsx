import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { setToast } from "../reducers/toastSlice";
import { HintType } from "@/components/HintPopup/HintPopup.interface";

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.log(action.payload.status)
    if (action.payload.status === 400) {
      const dispatch = api.dispatch;
      dispatch(setToast({type: HintType.Error, text: 'Пользователь уже существует'}))
    }
  }
  return next(action);
}