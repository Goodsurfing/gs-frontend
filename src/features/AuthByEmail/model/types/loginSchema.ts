export interface LoginSchema {
  token: string;
  email: string;
  password: string;
}

export enum LoginApiEndpoints {
  LOGIN = "/login_check"
}
