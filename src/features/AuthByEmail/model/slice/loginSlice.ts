import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LoginSchema } from "../types/loginSchema";

const initialState: LoginSchema = {
  email: "",
  password: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const { actions: loginActions } = loginSlice;
export const { reducer: loginReducer } = loginSlice;
