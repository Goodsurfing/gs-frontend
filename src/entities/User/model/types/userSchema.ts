export interface User {
    username: string;
    token: string,
    mercureToken: string,
    isVerified: boolean,
    rememberMe: boolean,
}

export interface UserSchema {
    authData?: User;
    _inited: boolean;
}
