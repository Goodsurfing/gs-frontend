import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IRegisterResponse } from "shared/types/api/auth/register.interface";

const initialState: IRegisterResponse = {
  id: "",
  email: "",
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterUserData: (
      state: IRegisterResponse,
      action: PayloadAction<IRegisterResponse>,
    ) => ({
      id: action.payload.id,
      email: action.payload.email,
    }),
  },
});

export const { actions: registerActions } = registerSlice;
export const { setRegisterUserData } = registerSlice.actions;
export const { reducer: registerReducers } = registerSlice;
export default registerSlice.reducer;
