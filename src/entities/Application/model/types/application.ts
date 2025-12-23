import { OfferApi } from "@/entities/Offer";
import { VolunteerApi, VolunteerMini } from "@/entities/Volunteer";
import { Pagination } from "@/types/api/pagination";
import { Category } from "@/types/categories";
import { Image } from "@/types/media";

// export type FormApplicationOffer = Pick<Offer, "id" | "where" | "when" | "description"
// | "status" | "averageRating" | "feedbacksCount" | "acceptedApplicationsCount">;
export type FormApplicationOffer = Pick<OfferApi, "id" | "title" | "description" | "address" | "status" | "categories"
| "acceptedApplicationsCount" | "averageRating" | "applicationEndDate" | "reviewsCount" | "shortDescription"> & {
    imagePath: string;
};

export interface FormApplication {
    id: number;
    volunteer: string;
    vacancy: FormApplicationOffer;
    startDate?: string;
    endDate?: string;
    status: FormApplicationStatus;
    chat: string;
}

// export type CreateFormApplicationRequest = Pick<FormApplication,
// "vacancy" | "startDate" | "endDate"
// >;

export interface FullFormApplication {
    id: number;
    volunteer: VolunteerApi;
    vacancy: FormApplicationOffer;
    startDate?: string;
    endDate?: string;
    status: FormApplicationStatus;
    chatId?: number;
    hasFeedbackFromVolunteer: boolean;
    hasFeedbackFromOrganization: boolean;
}

export type SimpleFormApplication = Omit<FullFormApplication, "volunteer"> & {
    // volunteer: string | VolunteerApi;
};

export interface Application {
    id: number;
    vacancy: {
        id: number;
        title: string | null;
        address: string | null;
        image: Image | null;
        status: string;
        categories: Category[];
    }
    volunteer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        image: Image | null;
        city: string | null;
        country: string | null;
    }
    startDate: string;
    endDate: string;
    status: FormApplicationStatus;
    chatId: number | null;
    isHasReview: boolean;
}

export type GetFormApplication = Omit<FullFormApplication, "volunteer"> & {
    volunteer: VolunteerMini;
};

export interface GetVolunteerFormApplicationResponse {
    data: Application[];
    pagination: Pagination;
}

export interface GetHostFormApplicationResponse {
    data: Application[];
    pagination: Pagination;
}

export interface Feedback {
    id: number;
    stars: number;
    applicationForm: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    volunteerId?: string;
    organizationAuthorId?: string;
    organizationId?: string;
    volunteerAuthorId?: string;
    vacancyId: number;
}

export type FormApplicationStatus = "new" | "accepted" | "canceled";
