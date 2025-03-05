import acrossRussia1 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/1.png";
import acrossRussia2 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/2.png";
import acrossRussia3 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/3.png";
import acrossRussia4 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/4.png";
import acrossRussia5 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/5.png";
import acrossRussia6 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/6.png";
import { AcrossRussia } from "@/types/acrossRussia";

export interface AcrossRussiaType {
    path: string;
    image: string;
    value: AcrossRussia,
    text: string,
}

export const useAcrossRussia = () => {
    const tags: AcrossRussiaType[] = [
        {
            image: acrossRussia1,
            value: "altai",
            text: "Алтай",
            path: "/",
        },
        {
            image: acrossRussia2,
            value: "kamchatka",
            text: "Камчатка",
            path: "/",
        },
        {
            image: acrossRussia3,
            value: "crimea",
            text: "Крым",
            path: "/",
        },
        {
            image: acrossRussia4,
            value: "caucasus",
            text: "Кавказ",
            path: "/",
        },
        {
            image: acrossRussia5,
            value: "ural",
            text: "Урал",
            path: "/",
        },
        {
            image: acrossRussia6,
            value: "baikal",
            text: "Байкал",
            path: "/",
        },
    ];

    return { tags };
};
