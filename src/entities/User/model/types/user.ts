export interface User {
  email: string;
  token: string;
}

export interface UserSchema {
  authData?: User;
}
