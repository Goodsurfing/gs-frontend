import { Article } from "@/entities/Article";
import { VideoGallery } from "@/entities/Host/model/types/host";
import { Offer } from "@/entities/Offer";
import { Profile } from "@/entities/Profile";
import { Review } from "@/entities/Review";
import { Gallery } from "@/modules/Gallery/model/types/gallery";
import { SkillsData } from "@/shared/data/skills";
import { Language } from "./language";
import { Language as LanguageApi } from "@/types/languages";
import { WhatToDoSkillType } from "@/types/skills";

export interface Volunteer extends Profile {
    skills?: SkillsData[];
    languages?: Language[];
    offers?: Offer[];
    reviews?: Review[];
    gallery?: Gallery;
    videoGallery?: VideoGallery;
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
}
