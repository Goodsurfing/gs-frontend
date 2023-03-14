export interface IUserInfoImage {
    id: string;
    name: string;
    size: string;
    type: string;
    url: string;
}

export interface IUserInfo {
    id: string;
    locale: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    gender: string;
    description: string;
    vk: string;
    telegram: string;
    instagram: string;
    facebook: string;
    birthDate: string;
    imageUuid?: string;
}

export interface IUserInfoForm {
    id: string;
    locale: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    gender: string;
    description: string;
    vk: string;
    telegram: string;
    instagram: string;
    facebook: string;
    birthDate: Date;
    imageUuid?: string;
}

export interface IGeneralFormGroup
    extends Pick<IUserInfoForm, "firstName" | "lastName"> {}
export interface IDateOfBirthFormGroup
    extends Pick<IUserInfoForm, "birthDate"> {}
export interface IGenderFormGroup extends Pick<IUserInfoForm, "gender"> {}
export interface ISoicalFormGroup extends Pick<IUserInfoForm, "vk" | "telegram" | "instagram" | "facebook"> {}
export interface IContactsFormGroup extends Pick<IUserInfoForm, "email" | "phone"> {}
