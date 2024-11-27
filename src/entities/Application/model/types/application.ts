import { Offer } from "@/entities/Offer";
import { VolunteerApi } from "@/entities/Volunteer";

type FormApplicationOffer = Pick<Offer, "id" | "where" | "when" | "description" | "status">;

export interface FormApplication {
    id: number;
    volunteer: string;
    vacancy: FormApplicationOffer;
    startDate: string;
    endDate: string;
    status: FormApplicationStatus;
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
}

export type FormApplicationStatus = "new" | "accepted" | "canceled";
