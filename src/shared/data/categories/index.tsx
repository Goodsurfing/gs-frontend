import { useTranslation } from "react-i18next";

import hostelImage from "@/shared/assets/images/categories/1.png";
import reserveImage from "@/shared/assets/images/categories/2.png";
import farmImage from "@/shared/assets/images/categories/3.png";
import animalsImage from "@/shared/assets/images/categories/4.png";
import teachingImage from "@/shared/assets/images/categories/5.png";
import childrenImage from "@/shared/assets/images/categories/6.png";
import charityImage from "@/shared/assets/images/categories/7.png";
import sportImage from "@/shared/assets/images/categories/8.png";
import artImage from "@/shared/assets/images/categories/9.png";
import archeologyImage from "@/shared/assets/images/categories/10.png";
import onlineImage from "@/shared/assets/images/categories/11.png";
import paidWork from "@/shared/assets/images/categories/12.png";
import international from "@/shared/assets/images/categories/13.png";
import other from "@/shared/assets/images/categories/14.png";
import { InviteCategoryType } from "./model/types/offerCategory";
import { CategoryType } from "@/types/categories";

export const useCategories = () => {
    const { t } = useTranslation();
    const tags: InviteCategoryType[] = [
        {
            image: hostelImage,
            value: "hostels",
            color: "#E0EBC6",
            text: t("category-offer.Работа в хостеле"),
            path: "/",
        },
        {
            image: reserveImage,
            value: "reserves_and_parks",
            color: "#C3A3E9",
            text: t("category-offer.Заповедники и парки"),
            path: "/",
        },
        {
            image: farmImage,
            value: "farm",
            color: "#C6E7E6",
            text: t("category-offer.Ферма"),
            path: "/",
        },
        {
            image: animalsImage,
            value: "animals",
            color: "#F7EBAB",
            text: t("category-offer.Животные"),
            path: "/",
        },
        {
            image: teachingImage,
            value: "teaching",
            color: "#E3C2CA",
            text: t("category-offer.Преподавание"),
            path: "/",
        },
        {
            image: childrenImage,
            value: "children",
            color: "#C4D8E9",
            text: t("category-offer.Дети"),
            path: "/",
        },
        {
            image: charityImage,
            value: "charity",
            color: "#EED6AC",
            text: t("category-offer.Благотворительность"),
            path: "/",
        },
        {
            image: sportImage,
            value: "sports",
            color: "#DBB5D4",
            text: t("category-offer.Спорт"),
            path: "/",
        },
        {
            image: artImage,
            value: "art",
            color: "#F7EBAB",
            text: t("category-offer.Искусство"),
            path: "/",
        },
        {
            image: archeologyImage,
            value: "archeology",
            color: "#EBC1FA",
            text: t("category-offer.Археология"),
            path: "/",
        },
        {
            image: onlineImage,
            value: "online",
            color: "#C0DAEB",
            text: t("category-offer.Онлайн"),
            path: "/",
        },
        {
            image: paidWork,
            value: "paid_work",
            color: "#C6E7E6",
            text: t("category-offer.Оплачиваемая работа"),
            path: "/",
        },
        {
            image: international,
            value: "international",
            color: "#EED6AC",
            text: t("category-offer.Международные"),
            path: "/",
        },
        {
            image: other,
            value: "other",
            color: "#D7C0A8",
            text: t("category-offer.Другое"),
            path: "/",
        },
    ];

    const getTranslation = (category: CategoryType | undefined): string | undefined => {
        const translations: Record<CategoryType, string> = {
            hostels: t("category-offer.Хостелы"),
            reserves_and_parks: t("category-offer.Заповедники и парки"),
            farm: t("category-offer.Ферма"),
            animals: t("category-offer.Животные"),
            teaching: t("category-offer.Преподавание"),
            children: t("category-offer.Дети"),
            charity: t("category-offer.Благотворительность"),
            sports: t("category-offer.Спорт"),
            art: t("category-offer.Искусство"),
            archeology: t("category-offer.Археология"),
            online: t("category-offer.Онлайн"),
            paid_work: t("category-offer.Оплачиваемая работа"),
            international: t("category-offer.Международные"),
            other: t("category-offer.Другое"),
        };
        if (category) {
            return translations[category];
        }
    };

    const getColorByCategory = (category: CategoryType): string | undefined => {
        const tag = tags.find((tagItem) => tagItem.value === category);
        return tag?.color;
    };

    return { tags, getTranslation, getColorByCategory };
};

export function getVacancyText(num: number): string {
    let text = "вакансий";
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
        text = "вакансия";
    } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
        text = "вакансии";
    }

    return `${text}`;
}
