import { useTranslation } from "react-i18next";
import image1 from "@/shared/assets/images/popular-places/1.png";
import image2 from "@/shared/assets/images/popular-places/2.png";
import image3 from "@/shared/assets/images/popular-places/3.png";
import image4 from "@/shared/assets/images/popular-places/4.png";
import image5 from "@/shared/assets/images/popular-places/5.png";
import image6 from "@/shared/assets/images/popular-places/6.png";

export const usePopularPlacesData = () => {
    const { t } = useTranslation("main");

    const popularPlacesData = [
        {
            text: "Латинская Америка",
            image: image1,
        },
        {
            text: "Европа",
            image: image2,
        },
        {
            text: "Азия",
            image: image3,
        },
        {
            text: "Алтай",
            image: image4,
        },
        {
            text: "Камчатка",
            image: image5,
        },
        {
            text: "Крым",
            image: image6,
        },
    ];

    const translatedData = popularPlacesData.map((item) => ({
        ...item,
        text: t(item.text),
    }));

    return translatedData;
};
