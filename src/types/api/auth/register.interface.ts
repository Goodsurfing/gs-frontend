export interface IAuthFormData {
    email: string;
    password: string;
    locale: string;
}

export interface IRegisterFormData {
    email: string;
    plainPassword: string;
    locale: string;
}

export interface IRegisterResponse {
    id: string;
    email: string;
}
