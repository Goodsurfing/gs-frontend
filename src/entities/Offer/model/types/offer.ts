import { Article } from "@/entities/Article";

import { OfferConditions } from "./offerConditions";
import { OfferContributor } from "./offerContributor";
import { OfferDescription } from "./offerDescription";
import { OfferFinishingTouches } from "./offerFinishingTouches";
import { OfferStatus } from "./offerStatus";
import { OfferWhatToDo } from "./offerWhatToDo";
import { OfferWhen } from "./offerWhen";
import { OfferWhere } from "./offerWhere";
import { OfferWhoNeeds } from "./offerWhoNeeds";
import { ImageType } from "@/entities/Profile";

export interface Offer {
    id: number;
    organization: OfferOrganization;
    where?: OfferWhere;
    when?: OfferWhen;
    howNeeds?: OfferWhoNeeds;
    description?: OfferDescription;
    whatToDo?: OfferWhatToDo;
    conditions?: OfferConditions;
    finishingTouches?: OfferFinishingTouches;
    contributors: OfferContributor[];
    // reviews?: Review[];
    articles?: Article[];
    status: OfferStatus;
    galleryItems: string[];
}

export interface OfferOrganization {
    id: string;
    name: string;
    type: string;
    avatar: ImageType;
}
export interface AddressAutoComplete {
    list: string[];
}

export interface OfferSchema {
    data?: Offer;
    form?: Offer;
}

export type SortValue = "urgency" | "popularity" | "novelty";
