import { UserRole } from "@/types/api/auth/login.interface";

export interface User {
    username: string;
    token: string;
    mercureToken: string;
    roles: UserRole[];
    rememberMe: boolean,
}

export interface UserSchema {
    authData?: User;
    _inited: boolean;
}
