import { AdminSort } from "@/entities/Admin";
import { Pagination } from "@/types/api/pagination";
import { Image } from "@/types/media";

export interface GetJournalsParams {
    sort: AdminSort;
    page: number;
    limit: number;
}

export interface GetJournals {
    id: number;
    name: string;
    description: string;
    created: string;
    reviewCount: number;
    likeCount: number;
    image: Image;
}

export interface GetJournalsResponse {
    data: GetJournals[];
    pagination: Pagination;
}

export type GetJournal = GetJournals & {
    isHasLike: boolean;
};

export interface GetReviewsJournal {
    description: string;
    created: string;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        image: Image | null;
    };
}

export interface GetReviewsJournalResponse {
    data: GetReviewsJournal[];
    pagination: Pagination;
}

export interface GetReviewsJournalParams {
    journalId: string;
    page: number;
    limit: number;
}

export interface CreateReviewJournal {
    description: string;
    journalId: string;
}
