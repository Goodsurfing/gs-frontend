import { Offer } from "@/entities/Offer";
import { VolunteerApi } from "@/entities/Volunteer";

export interface FormApplication {
    id: number;
    volunteer: string;
    vacancy: string;
    startDate: string;
    endDate: string;
    status: string;
}

export type CreateFormApplicationRequest = Pick<FormApplication,
"vacancy" | "startDate" | "endDate"
>;

export interface FullFormApplication {
    id: number;
    volunteer: VolunteerApi;
    vacancy: Offer;
    startDate: string;
    endDate: string;
    status: FormApplicationStatus;
}

export type FormApplicationStatus = "new" | "accepted" | "canceled";
