export interface IUserInfoImage {
    id: string;
    name: string;
    size: string;
    type: string;
    url: string;
}

export interface IUserOrganization {
    id: string;
    name: string;
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
    organizations: [] | IUserOrganization[]
}

export interface IUserInfoForm extends Omit<IUserInfo, 'birthDate'> {
    birthDate: Date;
}

export interface IGeneralFormGroup
    extends Pick<IUserInfoForm, 'firstName' | 'lastName'> {}
export interface IDateOfBirthFormGroup
    extends Pick<IUserInfoForm, 'birthDate'> {}
export interface IGenderFormGroup extends Pick<IUserInfoForm, 'gender'> {}
export interface ISoicalFormGroup extends Pick<IUserInfoForm, 'vk' | 'telegram' | 'instagram' | 'facebook'> {}
export interface IContactsFormGroup extends Pick<IUserInfoForm, 'email' | 'phone'> {}
