import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ILoginResponse } from "shared/types/api/auth/login.interface";

const initialState: ILoginResponse = {
  token: localStorage.getItem("token") || "",
};

export const loginSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setLoginUserData: (
      state: ILoginResponse,
      action: PayloadAction<ILoginResponse>,
    ) => ({
      token: action.payload.token,
    }),
    logout: () => {
      localStorage.removeItem("token");
      return {
        token: "",
      };
    },
  },
});

export const { setLoginUserData, logout } = loginSlice.actions;
export default loginSlice.reducer;
