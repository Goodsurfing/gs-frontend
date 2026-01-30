import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

export interface Achievement {
    id: number;
    name: string;
    imagePath: string;
}

export type GetAchievement = Achievement & {
    nameEn: string;
    nameEs: string;
};

export interface GetAchievementRequest {
    lang: Locale;
}
