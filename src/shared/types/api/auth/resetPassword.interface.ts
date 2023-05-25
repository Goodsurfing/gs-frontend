import { IAuthFormData } from "./register.interface";

export interface IResetPasswordRequestFormData
    extends Pick<IAuthFormData, "email"> {}

export interface IResetPasswordVerifyData {
    token: string;
    plainPassword: string;
}

export interface IResetPasswordRequestResponse {
    email: string;
}

export type IResetPasswordVerifyResponse = [];
