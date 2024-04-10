export type Gender = "female" | "male" | "other";

export type LevelLanguage = "not_matter" | "beginner" | "elementary" | "lower_intermediate" | "upper_intermediate" | "advanced" | "proficiency";

export interface Language {
    language: string;
    level: LevelLanguage
}

export type Languages = Language[];

export type ReceptionPlace = "any" | "foreigners" | "compatriot";

export interface Age {
    minAge: number;
    maxAge: number;
}

export interface OfferWhoNeeds {
    genders: Gender[];
    ageMax: number;
    ageMin: number;
    needAllLanguages: boolean,
    languages: Languages;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo?: string;
}

export interface OfferWhoNeedsApi {
    id: string;
    genders: Gender[];
    ageMax: number;
    ageMin: number;
    needAllLanguages: boolean,
    requiredLanguages: Languages;
    volunteerPlaceCount: number;
    receptionPlace: ReceptionPlace;
    additionalInfo?: string;
}
