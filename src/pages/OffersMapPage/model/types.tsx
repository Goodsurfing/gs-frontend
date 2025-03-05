import { SortValue } from "@/entities/Offer";
import { CategoryType } from "@/types/categories";

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
    category: CategoryType[];
    participationPeriod: number[];
    withChildren: boolean;
    languages: string[];
    provided: Provided[];
}
