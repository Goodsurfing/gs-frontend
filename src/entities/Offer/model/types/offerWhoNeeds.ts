export type Gender = "female" | "male" | "other";

export type LevelLanguage = "not_matter" | "beginner" | "elementary" | "lower_intermediate" | "upper_intermediate" | "advanced" | "proficiency";

export interface Language {
    language: string;
    languageLevel: LevelLanguage
}

export type Languages = Language[];

export type ReceptionPlace = "any" | "foreigners" | "compatriot";

export interface Age {
    minAge: number;
    maxAge: number;
}

export interface OfferWhoNeeds {
    gender: Gender[];
    ageMax: number;
    ageMin: number;
    needAllLanguages: boolean,
    requiredLanguages: Languages;
    volunteerPlaceCount: number;
    receptionPlace: ReceptionPlace;
    additionalInfo: string;
}
