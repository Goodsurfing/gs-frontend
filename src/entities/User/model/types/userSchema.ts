export interface User {
    username: string;
    token: string,
    mercureToken: string,
}

export interface UserSchema {
    authData?: User;
    _inited: boolean;
}
