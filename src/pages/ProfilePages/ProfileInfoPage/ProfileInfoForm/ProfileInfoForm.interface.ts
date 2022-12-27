export interface IUserInfo {
    id: string;
    locale: string;
    email: string;
    firstName: string | number | readonly string[] | undefined;
    lastName: string | number | readonly string[] | undefined;
    gender: string | null;
    birthDate: string | null;
}

export interface IGeneralFormGroup extends Pick<IUserInfo, "firstName" | "lastName"> {}
export interface IDateOfBirthFormGroup extends Pick<IUserInfo, "birthDate"> {}
export interface IGenderFormGroup extends Pick<IUserInfo, "gender"> {}
export interface IContactsFormGroup extends Pick<IUserInfo, "email"> {}
