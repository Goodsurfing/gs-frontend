export interface IAuthFormData {
    email: string;
    password: string;
    locale: string;
}

export interface IAuthLoginData {
    username: string;
    password: string;
}

export enum AuthApiEndpoints {
    REGISTER = "/register/",
    LOGIN = "/login_check",
}

export interface IRegisterResponse {
    id: string;
    email: string;
}

export interface ILoginResponse {
    token: string;
}
