import { Languages, SortValue } from "@/entities/Offer";

export interface OffersSortFields {
    sortValue: SortValue;
    showClosedOffers: boolean;
}

export interface Periods {
    start: Date | undefined;
    end: Date | undefined;
}

export interface ParticipationPeriod {
    from: number;
    to: number
}

export type Category = "hostels" | "reserves_and_parks" | "farm" | "animals" | "teaching" | "children" | "charity" | "sports" | "art" | "archeology" | "online" | "other";

export type Provided = "housing" | "food" | "padidTravel";

export interface OffersFilterFields {
    periods: Periods;
    category: Category[];
    participationPeriod: ParticipationPeriod;
    withChildren: boolean;
    languages: Languages;
    provided: Provided;
}
