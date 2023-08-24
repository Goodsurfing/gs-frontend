import { Locale } from "@/entities/Locale";
import { Gender } from "@/entities/Profile";

export interface ProfileDateOfBirth {
    day?: number;
    mounth?: number;
    year?: number;
}

export interface ProfileAbout {
    firstName?: string;
    lastName?: string;
}

export type ProfileGender = Gender;

export interface ProfileLocale {
    country?: string;
    city?: string;
    language: Locale;
}

export interface ProfileContacts {
    email: string;
    phone?: number;
}

export type ProfileAboutMe = string;

export interface ProfileSocial {
    vk?: string;
    instagram?: string;
    telegram?: string;
    facebook?: string;
}

export interface ProfileInfoFields {
    about: ProfileAbout;
    birthDate: ProfileDateOfBirth;
    gender?: ProfileGender;
    locale: ProfileLocale;
    contacts: ProfileContacts;
    aboutMe: ProfileAboutMe;
    social: ProfileSocial;
    profileAvatar: string;
}
