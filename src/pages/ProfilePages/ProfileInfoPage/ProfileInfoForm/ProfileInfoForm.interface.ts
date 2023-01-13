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
    image?: any
}

export interface IGeneralFormGroup
    extends Pick<IUserInfo, "firstName" | "lastName" | "image"> {}
export interface IDateOfBirthFormGroup extends Pick<IUserInfo, "birthDate"> {}
export interface IGenderFormGroup extends Pick<IUserInfo, "gender"> {}
export interface IContactsFormGroup extends Pick<IUserInfo, "email"> {}
