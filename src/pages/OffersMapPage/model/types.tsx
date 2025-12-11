import { SortValue } from "@/entities/Offer";

export interface OffersSortFields {
    sortValue: SortValue;
    showClosedOffers: boolean;
}

export interface Periods {
    start: Date | undefined;
    end: Date | undefined;
}

export type Provided = "housing" | "food" | "paidTravel";

export interface OffersFilterFields {
    offersSort: OffersSortFields;
    periods: Periods;
    category: number[];
    participationPeriod: number[];
    withChildren: boolean;
    languages: string[];
    provided: Provided[];
    // search: string;
}
