import popularPlace1 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/1.png";
import popularPlace2 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/2.png";
import popularPlace3 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/3.png";
import popularPlace4 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/4.png";
import popularPlace5 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/5.png";
import popularPlace6 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/6.png";

import { PopularPlaceType } from "@/types/popularPlaces";

export interface PopularPlacesyType {
    path: string;
    image: string;
    value: PopularPlaceType,
    text: string,
}

export const usePopularPlaces = () => {
    const tags: PopularPlacesyType[] = [
        {
            image: popularPlace1,
            value: "latin_america",
            text: "Латинская Америка",
            path: "/",
        },
        {
            image: popularPlace2,
            value: "europe",
            text: "Европа",
            path: "/",
        },
        {
            image: popularPlace3,
            value: "asia",
            text: "Азия",
            path: "/",
        },
        {
            image: popularPlace4,
            value: "africa",
            text: "Африка",
            path: "/",
        },
        {
            image: popularPlace5,
            value: "france",
            text: "Франция",
            path: "/",
        },
        {
            image: popularPlace6,
            value: "germany",
            text: "Германия",
            path: "/",
        },
    ];

    return { tags };
};
