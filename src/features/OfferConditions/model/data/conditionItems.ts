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
        { text: t("conditions.Продкуты"), icon: productsIcon, id: "products" },
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

    return {
        liveItems, foodItems, payedRideItems, goodsItems, extraAvailiablesItems,
    };
};
