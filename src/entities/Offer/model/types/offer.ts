import { CategoryType, CategoryWithoutImage } from "@/types/categories";
import { WhatToDoSkillType } from "@/types/skills";

import { Article } from "@/entities/Article";

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
import { Image } from "@/types/media";

export interface Offer {
    id: number;
    status: OfferStatus;
    organization: OfferOrganization;
    videoGallery: string[];
    galleryImages: Image[];
    averageRating: number;
    reviewsCount: number;
    where?: OfferWhere;
    when?: OfferWhen;
    howNeed?: OfferWhoNeeds;
    description?: OfferDescription;
    whatToDo?: OfferWhatToDo;
    conditions?: OfferConditions;
    finishingTouche?: OfferFinishingTouches;
    contributors: OfferContributor[];
    // reviews?: Review[];
    articles?: Article[];
    canEdit: boolean;
    canParticipate: boolean;
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
        image: Image;
    }
    image: Image | null;
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
    categories: CategoryWithoutImage[];
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
    otherType: string;
    shortDescription: string,
    image: Image | null;
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
