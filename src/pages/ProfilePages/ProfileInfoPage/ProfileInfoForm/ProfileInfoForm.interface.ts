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
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    imageUuid?: string;
    image?: any;
}

export interface IUserInfoForm {
    id: string;
    locale: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    imageUuid?: string;
    image?: any;
}

export interface IGeneralFormGroup
    extends Pick<IUserInfoForm, "firstName" | "lastName" | "image"> {}
export interface IDateOfBirthFormGroup
    extends Pick<IUserInfoForm, "birthDate"> {}
export interface IGenderFormGroup extends Pick<IUserInfoForm, "gender"> {}
export interface IContactsFormGroup extends Pick<IUserInfoForm, "email"> {}
