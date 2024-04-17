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
import { OfferStatus } from "./offerStatus";

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
}

export interface OfferSchema {
    data?: Offer;
    form?: Offer;
}

export type SortValue = "urgency" | "popularity" | "novelty";
