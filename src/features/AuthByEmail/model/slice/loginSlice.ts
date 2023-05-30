import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { loginApi } from "../services/loginApi";
import { LoginSchema } from "../types/loginSchema";

const initialState: LoginSchema = {
  token: undefined,
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
  extraReducers: (builder) => {
    builder.addMatcher(
      loginApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
      },
    );
  },
});

export const { actions: loginActions } = loginSlice;
export const { reducer: loginReducer } = loginSlice;
