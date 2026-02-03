import { Locale } from "@/entities/Locale";
import { Pagination } from "../api/pagination";
import { Image } from "../media";

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

export type GetCategory = Category & {
    nameEn: string;
    nameEs: string;
};

export interface GetCategoryRequest {
    lang: Locale;
}

export type CategoryCountVacancy = Category & {
    vacancyCount: number;
};

export type CategoryImageObject = Omit<Category, "imagePath"> & {
    image: Image;
};
export interface CreateCategoryParams {
    name: string;
    nameEn: string;
    nameEs: string;
    color: string;
    image: File;
}

export type CategoryWithoutImage = Omit<Category, "imagePath">;

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
