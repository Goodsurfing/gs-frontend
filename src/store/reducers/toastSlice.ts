import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { HintType } from "@/components/HintPopup/HintPopup.interface";
import { IHintPopup } from "@/components/HintPopup/HintPopup.interface";

export interface IToast extends Pick<IHintPopup, 'text' | "type"> {}

const initialState: IToast = {
    text: "",
    type: HintType.Error,
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast: (state: IHintPopup, action: PayloadAction<IToast>) => {
      return {
        text: action.payload.text,
        type: action.payload.type
      }
    }
  },
});

export const { setToast } = toastSlice.actions
export default toastSlice.reducer;