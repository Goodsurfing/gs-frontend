import { Image } from "../media";

export interface Achievement {
    id: number;
    name: string;
    imagePath: string;
}

export interface AchievementWithImage {
    id: number;
    name: string;
    image: Image;
}
