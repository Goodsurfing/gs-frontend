export enum AuthApiEndpoints {
    REGISTER = "/users",
    LOGIN = "/token",
    RESET_PASSWORD_REQUEST = "/reset_password_requests",
    RESET_PASSWORD = "/password_reset/confirm",
    RESEND_EMAIL_VERIFICATION = "/email-verifications/resend",
}

export interface IGenericResponse {
    status: string;
    message: string;
}
