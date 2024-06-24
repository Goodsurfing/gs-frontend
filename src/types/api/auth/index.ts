export enum AuthApiEndpoints {
    REGISTER = "/users",
    LOGIN = "/auth",
    RESET_PASSWORD_REQUEST = "/user/reset-password/request",
    RESET_PASSWORD = "/user/reset-password/",
}

export interface IGenericResponse {
    status: string;
    message: string;
}
