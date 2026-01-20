import { useTranslation } from "react-i18next";
import {
    airConditioningIcon,
    bathIcon,
    bedIcon,
    breakfastIcon,
    campingTentIcon,
    classIcon,
    electricityIcon,
    excursionsIcon,
    fullIcon,
    horsingIcon,
    hotWaterIcon,
    houseIcon,
    languageIcon,
    otherIcon,
    partPaymentIcon,
    pickupIcon,
    placeIcon,
    productsIcon,
    roomIcon,
    transferIcon,
    vegetarianIcon,
    wiFiIcon,
} from "@/shared/data/icons/conditions";
import {
    ExtraAvailiablesItems,
    FoodItems,
    GoodsItems,
    LiveItems,
    PayedRideItems,
} from "../types/conditionsData";

export const useConditionItems = () => {
    const { t } = useTranslation("offer");

    const liveItems: LiveItems[] = [
        { text: t("conditions.Отдельный дом"), icon: houseIcon, id: "house" },
        { text: t("conditions.Комната"), icon: roomIcon, id: "room" },
        { text: t("conditions.Койко-место"), icon: bedIcon, id: "bed" },
        { text: t("conditions.Палатка"), icon: campingTentIcon, id: "tent" },
        { text: t("conditions.Место под палатку"), icon: pickupIcon, id: "tent_place" },
    ];

    const foodItems: FoodItems[] = [
        { text: t("conditions.Полный пансион"), icon: fullIcon, id: "full" },
        { text: t("conditions.Завтрак включен"), icon: breakfastIcon, id: "breakfast" },
        { text: t("conditions.Продукты"), icon: productsIcon, id: "products" },
        { text: t("conditions.Вегетарианское"), icon: vegetarianIcon, id: "vegetarian" },
    ];

    const payedRideItems: PayedRideItems[] = [
        { text: t("conditions.Полная оплата проезда"), icon: fullIcon, id: "full" },
        { text: t("conditions.Компенсация стоимости проезда"), icon: breakfastIcon, id: "partial" },
        { text: t("conditions.Частичная компенсация затрат"), icon: partPaymentIcon, id: "reimbursement" },
        { text: t("conditions.Заброска из пункта сбора"), icon: placeIcon, id: "pick-up" },
        { text: t("conditions.Трансфер из/в аэропорта/вокзала"), icon: transferIcon, id: "transfer" },
    ];

    const goodsItems: GoodsItems[] = [
        { text: t("conditions.Горячая вода"), icon: hotWaterIcon, id: "hot-water" },
        { text: t("conditions.Интернет и wi-fi"), icon: wiFiIcon, id: "wi-fi" },
        { text: t("conditions.Электричество"), icon: electricityIcon, id: "electricity" },
        { text: t("conditions.Кондиционер"), icon: airConditioningIcon, id: "conditioner" },
        { text: t("conditions.Баня/сауна"), icon: bathIcon, id: "bath" },
    ];

    const extraAvailiablesItems: ExtraAvailiablesItems[] = [
        { text: t("conditions.Мастер-классы/ обучающие курсы"), icon: classIcon, id: "master_class" },
        { text: t("conditions.Экскурсии"), icon: excursionsIcon, id: "excursions" },
        { text: t("conditions.Катание на лошадях"), icon: horsingIcon, id: "horses" },
        { text: t("conditions.Языковые уроки"), icon: languageIcon, id: "languages" },
        { text: t("conditions.Другое"), icon: otherIcon, id: "additional" },
    ];

    const getTranslation = (condition: string | undefined): string | undefined => {
        const translations: Record<string, string> = {
            "Отдельный дом": t("conditions.Отдельный дом"),
            Комната: t("conditions.Комната"),
            "Койко-место": t("conditions.Койко-место"),
            Палатка: t("conditions.Палатка"),
            "Место под палатку": t("conditions.Место под палатку"),
            "Полный пансион": t("conditions.Полный пансион"),
            "Завтрак включен": t("conditions.Завтрак включен"),
            Продукты: t("conditions.Продукты"),
            Вегетарианское: t("conditions.Вегетарианское"),
            "Полная оплата проезда": t("conditions.Полная оплата проезда"),
            "Компенсация стоимости проезда": t("conditions.Компенсация стоимости проезда"),
            "Частичная компенсация затрат": t("conditions.Частичная компенсация затрат"),
            "Заброска из пункта сбора": t("conditions.Заброска из пункта сбора"),
            "Трансфер из/в аэропорта/вокзала": t("conditions.Трансфер из/в аэропорта/вокзала"),
            "Горячая вода": t("conditions.Горячая вода"),
            "Интернет и wi-fi": t("conditions.Интернет и wi-fi"),
            Электричество: t("conditions.Электричество"),
            Кондиционер: t("conditions.Кондиционер"),
            "Баня/сауна": t("conditions.Баня/сауна"),
            "Мастер-классы/ обучающие курсы": t("conditions.Мастер-классы/ обучающие курсы"),
            Экскурсии: t("conditions.Экскурсии"),
            "Катание на лошадях": t("conditions.Катание на лошадях"),
            "Языковые уроки": t("conditions.Языковые уроки"),
            Другое: t("conditions.Другое"),
        };
        if (condition) {
            return translations[condition];
        }
    };

    return {
        liveItems,
        foodItems,
        payedRideItems,
        goodsItems,
        extraAvailiablesItems,
        getTranslation,
    };
};
