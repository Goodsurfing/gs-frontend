export enum AuthApiEndpoints {
    REGISTER = "register/",
    LOGIN = "login_check",
    RESET_PASSWORD_REQUEST = "user/reset-password/request",
    RESET_PASSWORD = "user/reset-password/",
}

export interface IGenericResponse {
    status: string;
    message: string;
}
