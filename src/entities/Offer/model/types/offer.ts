import { Review } from "@/entities/Review";
import { OfferConditions } from "./offerConditions";
import { OfferContributor } from "./offerContributor";
import { OfferDescription } from "./offerDescription";
import { OfferFinishingTouches } from "./offerFinishingTouches";
import { OfferWhatToDo } from "./offerWhatToDo";
import { OfferWhen } from "./offerWhen";
import { OfferWhere } from "./offerWhere";
import { OfferWhoNeeds } from "./offerWhoNeeds";
import { Article } from "@/entities/Article";
import { OfferState, OfferStatus } from "./offerStatus";

export interface Offer {
    id: string;
    where: OfferWhere;
    when: OfferWhen;
    whoNeeds: OfferWhoNeeds;
    description: OfferDescription;
    whatToDo: OfferWhatToDo;
    conditions: OfferConditions;
    finishingTouches: OfferFinishingTouches;
    contributors: OfferContributor[];
    reviews?: Review[];
    articles?: Article[];
    status: OfferStatus;
    state: OfferState;
}

export interface MyOffers {
    list: [
        {
            id: string,
            title: string,
            description: string,
            location: string,
            category: string,
            rating: number,
            likes: number,
            reviews: number,
            acceptedRequests: number,
            status: OfferStatus;
        },
    ] | []
}

export interface AddressAutoComplete {
    list: string[]
}

export interface OfferSchema {
    data?: Offer;
    form?: Offer;
}

export type SortValue = "urgency" | "popularity" | "novelty";
