export interface LoginByEmailProps {
    email: string;
    password: string;
}

export type ResendVerificationRequest = Pick<LoginByEmailProps, "email">;

export interface LoginByEmailFields extends LoginByEmailProps {
    rememberMe: boolean;
}

export type UserRole = "ROLE_USER" | "ROLE_ADMIN";
export interface LoginResponse {
    accessToken: string;
    mercureToken: string;
    roles: UserRole[];
}

export interface LoginAdminFields {
    email: string;
    password: string;
    rememberMe: boolean;
}
