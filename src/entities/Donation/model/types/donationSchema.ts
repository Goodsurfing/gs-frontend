import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { Pagination } from "@/types/api/pagination";
import { CategoryNews } from "@/types/categories";
import { Image } from "@/types/media";

export interface DonationFilterFields {
    category: number[];
    showFinishedProjects: boolean;
    showSuccessProjects: boolean;
}

export type DonationStatus = "draft" | "active" | "close";

export interface GetDonations {
    id: string;
    name: string | null;
    shortDescription: string | null;
    percentAmountCollect: number;
    daysLeft: number;
    isSuccess: boolean;
    isClose: boolean;
    isCanEdit: boolean;
    organization: {
        name: string;
    }
    image: Image | null;
}

export interface GetDonationsResponse {
    data: GetDonations[];
    pagination: Pagination;
}

export interface GetDonationsParams {
    sort: AdminSort;
    isAuth: boolean;
    status: DonationStatus;
    categoryId: number;
    isCloseProject: boolean;
    isSuccessProject: boolean;
    name: string;
    page: number;
    limit: number;
}

export type GetDonation = Omit<GetDonations, "shortDescription" | "isSuccess" | "isClose" | "organization"> & {
    status: DonationStatus;
    address: string;
    description: string;
    startDate: string;
    peopleSupportCount: number;
    percentAmountCollect: number;
    daysLeft: number;
    amount: number;
    minAmount: number;
    latitude: number;
    longitude: number;
    isCanSupport: boolean;
    categories: CategoryNews[];
};

export interface GetDonationParams {
    id: string;
    lang: Locale;
}

export type GetDonationsMap = Pick <GetDonation, "id" | "name"
| "latitude" | "longitude" | "image" | "categories">;

export interface GetDonationsMapParams {
    categoryId: number;
    isCloseProject: boolean;
    isSuccessProject: boolean;
    name: string;
}

export interface CreateDonationResponse {
    id: string;
}

// Address

export type GetDonationAddress = Pick<GetDonation, "address"
| "latitude" | "longitude" | "id">;

export type UpdateDonationAddress = Omit<GetDonationAddress, | "id">;

export interface UpdateDonationAddressRequest {
    id: string;
    body: UpdateDonationAddress;
}

// When

export type GetDonationWhen = Pick<GetDonation, "id"> & {
    endDate: string;
    isUntilAmountCollected: boolean;
};

export type UpdateDonationWhen = Omit<GetDonationWhen, | "id">;

export interface UpdateDonationWhenRequest {
    id: string;
    body: UpdateDonationWhen;
}

// How many

export type GetDonationHowMany = Pick<GetDonation, "id"> & {
    amount: number;
    minAmount: number;
};

export type UpdateDonationHowMany = Omit<GetDonationHowMany, | "id">;

export interface UpdateDonationHowManyRequest {
    id: string;
    body: UpdateDonationHowMany;
}

// Description

export type GetDonationDescription = Pick<GetDonation, "id"
| "name" | "description" | "image"> & {
    shortDescription: string;
    galleryImages: Image[];
    categoryIds: number[];
};

export type UpdateDonationDescription = Omit<GetDonationDescription, | "id">;

export interface UpdateDonationDescriptionRequest {
    id: string;
    body: UpdateDonationDescription;
}

// Auto Messages

export type GetDonationAutoMessages = Pick<GetDonation, "id"> & {
    wordsGratitude: string;
    urlProgressWork: string[];
    status: DonationStatus;
};

export type UpdateDonationAutoMessages = Omit<GetDonationAutoMessages, | "id">;

export interface UpdateDonationAutoMessagesRequest {
    id: string;
    body: UpdateDonationAutoMessages;
}

// Status

export interface UpdateDonationStatus {
    status: DonationStatus;
}

export interface UpdateDonationStatusRequest {
    id: string;
    body: UpdateDonationStatus;
}
