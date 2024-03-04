export type Gender = "female" | "male" | "other";

export type LevelLanguage = "not_matter" | "beginner" | "elementary" | "lower_intermediate" | "upper_intermediate" | "advanced" | "proficiency";

export interface Language {
    languageId: string;
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
    age?: Age;
    needAllLanguages: boolean,
    languages: Languages;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo?: string;
}
