import { Article } from "@/entities/Article";
import { Offer } from "@/entities/Offer";
import { Gender, Profile } from "@/entities/Profile";
import { Review } from "@/entities/Review";
import { SkillsData } from "@/shared/data/skills";
import { Language, Language as LanguageApi } from "@/types/languages";
import { WhatToDoSkillType } from "@/types/skills";
import { MediaObjectType } from "@/types/media";
import { Gallery } from "@/entities/Gallery";
import { Locale } from "@/entities/Locale";

export interface Volunteer extends Profile {
    skills?: SkillsData[];
    languages?: Language[];
    offers?: Offer[];
    reviews?: Review[];
    gallery?: Gallery;
    certificates?: string[];
    articles?: Article[];
    favoriteOffers?: Offer[];
    isMember: boolean;
    subscribers?: Profile[];
}

export interface VolunteerApi {
    profile: Profile;
    externalInfo: string;
    skills: WhatToDoSkillType[];
    additionalSkills: string[];
    languages: LanguageApi[];
    certificates: MediaObjectType[];
    averageRating?: number;
    feedbacksCount: number;
    participatedVacancies: string[];
}

export type VolunteerType = Omit<VolunteerApi, "profile" | "certificates"> & {
    certificates: string[];
};

export interface UpdateVolunteer {
    skillIds: number[];
    languages: Language[];
    additionalSkills: string[];
    externalInfo: string;
}

export interface VolunteerMini {
    id: string;
    email: string;
    locale: Locale;
    firstName?: string;
    lastName?: string;
    imagePath?: string;
    gender: Gender;
    country: string;
    city: string;
    periods: LanguageApi[];
    certificates: string[];
    averageRating: number;
    reviewCount: number;
}
