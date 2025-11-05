export interface LoginByEmailProps {
    email: string;
    password: string;
}

export type ResendVerificationRequest = Pick<LoginByEmailProps, "email">;

export interface LoginByEmailFields extends LoginByEmailProps {
    rememberMe: boolean;
}

export interface LoginResponse {
    accessToken: string;
    mercureToken: string;
}

export interface LoginAdminFields {
    email: string;
    password: string;
    rememberMe: boolean;
}
