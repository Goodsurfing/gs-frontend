import { Language, OldLanguage } from "@/types/languages";

export type Gender = "female" | "male" | "other";

export type ReceptionPlace = "any" | "foreigners" | "compatriot";

export interface Age {
    minAge: number | null;
    maxAge: number | null;
}

export interface OfferWhoNeeds {
    genders: Gender[];
    ageMax: number;
    ageMin: number;
    needAllLanguages: boolean,
    languages: Language[];
    volunteerPlaceCount: number;
    receptionPlace: ReceptionPlace;
    additionalInfo: string;
}

export interface OldOfferWhoNeeds {
    gender: Gender[];
    ageMax: number;
    ageMin: number;
    volunteerPlaceCount: number;
    receptionPlace: ReceptionPlace;
    additionalInfo: string;
    needAllLanguages: boolean,
    requiredLanguages: OldLanguage[];
}
