export interface IAuthFormData {
    email: string;
    password: string;
}

export enum AuthApiEndpoints {
    REGISTER = "/register/",
}

export interface IRegisterResponse {
    id: string;
    email: string;
}
