export type Gender = "woman" | "man" | "other";

export type Languages = string[];

export type ReceptionPlace = "any" | "foreigners" | "compatriot";

export interface OfferWhoNeeds {
    gender: Gender;
    age?: string;
    languages: Languages;
    volunteerPlaces: number;
    receptionPlace: ReceptionPlace;
    additionalInfo?: string;
}
