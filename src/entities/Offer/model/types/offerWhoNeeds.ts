import { Language } from "@/types/languages";

export type Gender = "female" | "male" | "other";

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
    requiredLanguages: Language[];
    volunteerPlaceCount: number;
    receptionPlace: ReceptionPlace;
    additionalInfo: string;
}
