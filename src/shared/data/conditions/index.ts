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

export type HouseImageObject = Omit<House, "imagePath"> & {
    image: Image;
};

export interface Food {
    id: number;
    name: string;
    imagePath: string;
}

export type FoodImageObject = Omit<Food, "imagePath"> & {
    image: Image;
};
