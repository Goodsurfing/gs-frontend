import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";
import { Image } from "@/types/media";

export interface GetAdminJournalsParams {
    sort: AdminSort;
    name: string;
    page: number;
    limit: number;
}

export interface GetAdminJournals {
    id: string;
    name: string;
    isActive: boolean;
    created: string;
    reviewCount: number;
}

export interface GetAdminJournalsResponse {
    data: GetAdminJournals[];
    pagination: Pagination
}

export type GetAdminJournal = GetAdminJournals & {
    description: string;
    image: Image;
};

export type CreateAdminJournal = Pick<GetAdminJournal, "name" |
"description" | "isActive"> & {
    imageId: string;
};

export interface UpdateAdminJournalParams {
    id: string;
    body: CreateAdminJournal;
}

// Review
export interface GetAdminReviewsJournalParams {
    sort: AdminSort;
    journalId: string;
    journalName: string;
    page: number;
    limit: number;
}

export interface GetAdminReviewsJournal {
    id: string;
    description: string;
    isActive: boolean;
    created: string;
    journal: {
        name: string;
    }
}

export interface GetAdminReviewsJournalResponse {
    data: GetAdminReviewsJournal[];
    pagination: Pagination;
}

export type GetAdminReviewJournal = Omit<GetAdminReviewsJournal, "journal">;

export interface UpdateAdminReviewJournal {
    description: string;
    isActive: boolean;
}

export interface UpdateAdminReviewJournalParams {
    id: string;
    body: UpdateAdminReviewJournal;
}
