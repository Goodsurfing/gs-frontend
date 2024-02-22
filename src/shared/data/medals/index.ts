import ambassador from "@/shared/assets/icons/medals/ambassador.svg";
import pioneer from "@/shared/assets/icons/medals/pioneer.svg";

export type MedalsData = {
    id: "ambassador" | "pioneer" | "participants" | "travel",
    text: string;
    icon?: string;
};

export const medalsData: MedalsData[] = [
    {
        id: "ambassador",
        text: "Амбассадор Гудсёрфинга",
        icon: ambassador,
    },
    {
        id: "pioneer",
        text: "Пионер Гудсёрфинга",
        icon: pioneer,
    },
    {
        id: "participants",
        text: "Участников",
    },
    {
        id: "travel",
        text: "Путешествий со смыслом",
    },
];
