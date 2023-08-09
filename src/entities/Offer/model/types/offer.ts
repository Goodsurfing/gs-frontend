import { OfferConditions } from "./offerConditions";
import { OfferDescription } from "./offerDescription";
import { OfferFinishingTouches } from "./offerFinishingTouches";
import { OfferWhatToDo } from "./offerWhatToDo";
import { OfferWhen } from "./offerWhen";
import { OfferWhere } from "./offerWhere";
import { OfferWhoNeeds } from "./offerWhoNeeds";

export interface Offer {
    where: OfferWhere;
    when: OfferWhen;
    whoNeeds: OfferWhoNeeds;
    description: OfferDescription;
    whatToDo: OfferWhatToDo;
    conditions: OfferConditions;
    finishingTouches: OfferFinishingTouches;
}

export interface OfferSchema {
    data?: Offer;
    form?: Offer;
}
