import { Pagination } from "../api/pagination";

export type CategoryType = "hostels" | "reserves_and_parks" | "farm" | "animals" | "teaching" | "children" | "charity" | "sports" | "art" | "archeology" | "online" | "paid_work" | "international" | "other";

export const categoryValues: CategoryType[] = [
    "hostels",
    "reserves_and_parks",
    "farm",
    "animals",
    "teaching",
    "children",
    "charity",
    "sports",
    "art",
    "archeology",
    "online",
    "paid_work",
    "international",
    "other",
];

export interface Category {
    id: number;
    name: string;
    color: string;
    imagePath: string;
}

export interface CreateCategoryParams {
    name: string;
    color: string;
    image: File;
}

export interface GetCategoryResponse {
    data: Category[];
    pagination: Pagination
}

export interface UpdateCategoryParams {
    id: number;
    data: Omit<CreateCategoryParams, "image"> & {
        image: File | string;
    };
}
