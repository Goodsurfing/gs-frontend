type Gender = "male" | "female";

export interface Profile {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
    country: string;
    city: string;
    locale: string;
    phone: string;
    imageUuid: string;
    aboutMe: string;
    vk?: string;
    facebook?: string;
    instagram?: string,
    telegram?: string
}

export interface ProfileSchema {
    data?: Profile;
    form?: Profile;
    readonly: boolean;
}
