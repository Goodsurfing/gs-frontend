import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";

export enum FeedbackStatus {
    New = "NEW",
    Processed = "PROCESSED",
}

export interface GetAdminFeedback {
    id: string;
    name: string;
    email: string;
    message: string;
    status: FeedbackStatus;
    created: string;
}

export interface GetAdminFeedbackListParams {
    sort: AdminSort;
    status: FeedbackStatus;
    page: number;
    limit: number;
}

export interface GetAdminFeedbackListResponse {
    data: GetAdminFeedback[];
    pagination: Pagination;
}

export interface UpdateAdminFeedbackParams {
    id: string;
    body: { status: FeedbackStatus };
}
