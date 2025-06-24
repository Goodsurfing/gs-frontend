import { Offer } from "@/entities/Offer";
import { VolunteerApi } from "@/entities/Volunteer";

export type FormApplicationOffer = Pick<Offer, "id" | "where" | "when" | "description" | "status">;

export interface FormApplication {
    id: number;
    volunteer: string;
    vacancy: FormApplicationOffer;
    startDate: string;
    endDate: string;
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
    startDate: string;
    endDate: string;
    status: FormApplicationStatus;
    chatId?: number;
    hasFeedbackFromVolunteer: boolean;
    hasFeedbackFromOrganization: boolean;
}

export type FormApplicationStatus = "new" | "accepted" | "canceled";
