import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { Image } from "@/types/media";

export interface Transfer {
    id: number;
    name: string;
    imagePath: string;
}

export type TransferImageObject = Omit<Transfer, "imagePath"> & {
    image: Image;
};

export interface House {
    id: number;
    name: string;
    imagePath: string;
}

export type GetHouse = House & {
    nameEn: string;
    nameEs: string;
};

export type HouseImageObject = Omit<House, "imagePath"> & {
    image: Image;
};

export interface Food {
    id: number;
    name: string;
    imagePath: string;
}

export type GetFood = Food & {
    nameEn: string;
    nameEs: string;
};

export interface GetFoodRequest {
    lang: Locale;
}

export type FoodImageObject = Omit<Food, "imagePath"> & {
    image: Image;
};
