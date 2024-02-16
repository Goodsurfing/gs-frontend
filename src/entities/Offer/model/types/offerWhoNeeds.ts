export type Gender = "woman" | "man" | "other";

export type LevelLanguage = "beginner" | "elementary" | "lower_intermediate" | "upper_intermediate" | "advanced" | "proficiency";

export interface Language {
    language: string;
    level: LevelLanguage
}

export type Languages = Language[];

export type ReceptionPlace = "any" | "foreigners" | "compatriot";

export interface OfferWhoNeeds {
    gender: Gender;
    age?: string;
    languages: Languages;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo?: string;
}
