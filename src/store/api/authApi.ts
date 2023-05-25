import { API_PUBLIC_BASE_URL } from "shared/api";
import {
  BaseQueryFn, createApi, FetchArgs, FetchBaseQueryError, fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { AuthApiEndpoints } from "types/api/auth";
import {
  IAuthLoginData,
  ILoginResponse,
} from "types/api/auth/login.interface";
import {
  IAuthFormData,
  IRegisterResponse,
} from "types/api/auth/register.interface";
import {
  IResetPasswordRequestFormData,
  IResetPasswordRequestResponse,
  IResetPasswordVerifyData,
  IResetPasswordVerifyResponse,
} from "types/api/auth/resetPassword.interface";
import { logout, setLoginUserData } from "../reducers/loginSlice";

const baseQuery = fetchBaseQuery({ baseUrl: API_PUBLIC_BASE_URL });

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result: any = await baseQuery(args, api, extraOptions);
  console.log(result.data.token);
  if (result.error && result.error.status === 401) {
    const refreshResult: any = await baseQuery(args, api, extraOptions);
    if (refreshResult.data) {
      api.dispatch(setLoginUserData(refreshResult.data.token));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const reauthApi = createApi({
  reducerPath: "reauthApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    authUser: build.mutation<ILoginResponse, IAuthLoginData>({
      query: (data: IAuthLoginData) => ({
        url: AuthApiEndpoints.LOGIN,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_PUBLIC_BASE_URL }),
  endpoints: (build) => ({
    registerUser: build.mutation<IRegisterResponse, IAuthFormData>({
      query: (data: IAuthFormData) => ({
        url: AuthApiEndpoints.REGISTER,
        method: "POST",
        body: data,
      }),
    }),
    loginUser: build.mutation<ILoginResponse, IAuthLoginData>({
      query: (data: IAuthLoginData) => ({
        url: AuthApiEndpoints.LOGIN,
        method: "POST",
        body: data,
      }),
    }),
    resetPasswordRequest: build.mutation<
                IResetPasswordRequestResponse,
                IResetPasswordRequestFormData
            >({
              query: (data: IResetPasswordRequestFormData) => ({
                url: AuthApiEndpoints.RESET_PASSWORD_REQUEST,
                method: "POST",
                body: data,
              }),
            }),
    resetPasswordVerify: build.mutation<
                IResetPasswordVerifyResponse,
                IResetPasswordVerifyData
            >({
              query: (data: IResetPasswordVerifyData) => ({
                url: AuthApiEndpoints.RESET_PASSWORD,
                method: "POST",
                body: data,
              }),
            }),
  }),
});
