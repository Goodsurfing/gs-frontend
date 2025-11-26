import { OfferApi } from "@/entities/Offer";
import { VolunteerApi, VolunteerMini } from "@/entities/Volunteer";
import { Pagination } from "@/types/api/pagination";

// export type FormApplicationOffer = Pick<Offer, "id" | "where" | "when" | "description"
// | "status" | "averageRating" | "feedbacksCount" | "acceptedApplicationsCount">;
export type FormApplicationOffer = Pick<OfferApi, "id" | "title" | "description" | "address" | "status" | "categories" |
"imagePath" | "acceptedApplicationsCount" | "averageRating" | "applicationEndDate" | "reviewsCount" | "shortDescription">;

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
    volunteer: string | VolunteerApi;
};

export type GetFormApplication = Omit<FullFormApplication, "volunteer"> & {
    volunteer: VolunteerMini;
};

export type GetFormVolunteerIdApplication = Omit<FullFormApplication, "volunteer"> & {
    volunteerId: string;
};

export interface GetVolunteerFormApplicationResponse {
    data: GetFormApplication[];
    pagination: Pagination;
}

export interface GetHostFormApplicationResponse {
    data: GetFormVolunteerIdApplication[];
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
