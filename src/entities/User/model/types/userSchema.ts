export interface User {
    username: string;
}

export interface UserSchema {
    authData?: User;
    _inited: boolean;
}
