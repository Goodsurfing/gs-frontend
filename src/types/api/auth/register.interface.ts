export interface IAuthFormData {
    email: string;
    password: string;
    locale: string;
}

export interface IRegisterFormData {
    email: string;
    plainPassword: string;
    locale: string;
    isActive: boolean;
    /** Чекбокс «Хочу получать письма…» — по умолчанию снят (GS-203) */
    marketingConsent?: boolean;
}

export interface IRegisterResponse {
    id: string;
    email: string;
}

export type IVerifyFormData = Omit<IAuthFormData, "password">;
