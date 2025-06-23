export interface LoginByEmailProps {
    email: string;
    password: string;
}

export interface LoginByEmailFields extends LoginByEmailProps {
    rememberMe: boolean;
}

export interface LoginResponse {
    accessToken: string;
    mercureToken: string;
}
