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
    items: GetAdminJournals[];
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
