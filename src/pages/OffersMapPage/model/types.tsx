import { SortValue } from "@/entities/Offer";

export interface OffersSortFields {
    sortValue: SortValue;
    showClosedOffers: boolean;
}

export interface Periods {
    start: Date | undefined;
    end: Date | undefined;
}

export type Category = "hostels" | "reserves_and_parks" | "farm" | "animals" | "teaching" | "children" | "charity" | "sports" | "art" | "archeology" | "online" | "other";

export type Provided = "housing" | "food" | "padidTravel";

export interface OffersFilterFields {
    offersSort: OffersSortFields;
    periods: Periods;
    category: Category[];
    participationPeriod: number[];
    withChildren: boolean;
    languages: string[];
    provided: Provided[];
}
