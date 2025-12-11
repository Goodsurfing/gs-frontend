import { CategoryType } from "@/types/categories";
import { WhatToDoSkillType } from "@/types/skills";

import { Article } from "@/entities/Article";
import { ImageType } from "@/entities/Profile";

import {
    Housing, Nutrition, OfferConditions, Travel,
} from "./offerConditions";
import { OfferContributor } from "./offerContributor";
import { OfferDescription } from "./offerDescription";
import {
    ExtraConditions,
    OfferFinishingTouches,
} from "./offerFinishingTouches";
import { OfferStatus } from "./offerStatus";
import { OfferWhatToDo } from "./offerWhatToDo";
import { OfferWhen, OfferWhenPeriods } from "./offerWhen";
import { OfferWhere } from "./offerWhere";
import { OfferWhoNeeds } from "./offerWhoNeeds";
import { Pagination } from "@/types/api/pagination";

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
    canEdit: boolean;
    canParticipate: boolean;
    averageRating?: number;
    feedbacksCount?: number;
    acceptedApplicationsCount: number;
}

export interface OfferApi {
    id: number;
    status: OfferStatus;
    organization: {
        id: string;
        name: string;
        type: string;
        otherType: string;
        shortDescription: string;
        imagePath: string;
    }
    imagePath?: string;
    averageRating: number;
    reviewsCount: number;
    address?: string;
    latitude?: number;
    longitude?: number;
    isFullYearAcceptable: boolean;
    isApplicableAtTheEnd: boolean;
    durationMinDays: number;
    durationMaxDays: number;
    applicationEndDate: string;
    title?: string;
    categories: CategoryType[];
    description?: string;
    shortDescription?: string;
    periods: OfferWhenPeriods[];
    acceptedApplicationsCount: number;
    updated: string;
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

// export interface OffersFilters {
//     start_date: string;
//     end_date: string;
//     min_duration_days: string;
//     max_duration_days: string;
//     languages: string[];
//     skills: WhatToDoSkillType[];
//     additionalConditions: ExtraConditions[];
//     housing: Housing[];
//     food: Nutrition[];
//     paidTravel: Travel[];
//     categories: CategoryType[];
//     "order[popularity]": string;
//     "order[updatedAt]": string;
//     search: string;
// }

export enum OfferSort {
    UpdatedAsc = "updated:asc",
    UpdatedDesc = "updated:desc",
    ReviewCountAsc = "reviewCount:asc",
    ReviewCountDesc = "reviewCount:desc",
    AverageRatingAsc = "averageRating:asc",
    AverageRatingDesc = "averageRating:desc",
    PopularityAsc = "popularity:asc",
    PopularityDesc = "popularity:desc",
}

export interface GetHostOffersFilters {
    sort: "updated:asc" | "updated:desc" | "status:asc" | "status:desc";
    statuses: OfferStatus[];
    page: number;
    limit: number;
    organizationId: string;
}

export interface HostOffer {
    id: number;
    status: OfferStatus;
    averageRating?: number,
    imagePath?: string;
    thumbnails: string[];
    title?: string;
    categories?: CategoryType[];
    reviewsCount?: number;
    address?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    shortDescription?: string;
    acceptedApplicationsCount: number;
}

export interface GetHostOffersResponse {
    data: HostOffer[];
    pagination: Pagination;
}

export interface GetOffersFilters {
    sort: OfferSort;
    id: number;
    startDate: string;
    endDate: string;
    minDurationDays: string;
    maxDurationDays: string;
    search: string;
    languages: string[];
    skillIds: WhatToDoSkillType[];
    additionalConditions: ExtraConditions[];
    houseIds: Housing[];
    foodIds: Nutrition[];
    transferIds: Travel[];
    categoryIds: number[];
    page: number;
    limit: number;
}

export interface GetOffersResponse {
    data: OfferApi[];
    pagination: Pagination;
}
