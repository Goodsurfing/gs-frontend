export interface IAuthFormData {
    email: string;
    password: string;
    locale: string;
}

export interface IAuthLoginData {
    username: string;
    password: string;
}

export interface IResetPasswordRequestFormData
    extends Pick<IAuthFormData, "email"> {}

export interface IResetPasswordVerifyData {
    token: string;
    plainPassword: string;
}

export interface IRegisterResponse {
    id: string;
    email: string;
}

export interface ILoginResponse {
    token: string;
}

export interface IResetPasswordRequestResponse {
    email: string;
}

export type IResetPasswordVerifyResponse = [];

export enum AuthApiEndpoints {
    REGISTER = "/register/",
    LOGIN = "/login_check",
    RESET_PASSWORD_REQUEST = "/user/reset-password/request",
    RESET_PASSWORD = "/user/reset-password/",
}
