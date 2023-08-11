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
    ExtraAvailiablesItems, FoodItems, GoodsItems, LiveItems, PayedRideItems,
} from "../types/conditionsData";

export const liveItems: LiveItems[] = [{
    text: "Отдельный дом",
    icon: houseIcon,
    id: "house",
}, {
    text: "Комната",
    icon: roomIcon,
    id: "room",
}, {
    text: "Койко-место",
    icon: bedIcon,
    id: "bed",
}, {
    text: "Палатка",
    icon: campingTentIcon,
    id: "tent",
}, {
    text: "Место под палатку",
    icon: pickupIcon,
    id: "tent-place",
}];

export const foodItems: FoodItems[] = [{
    text: "Полный пансион",
    icon: fullIcon,
    id: "full",
}, {
    text: "Завтрак включен",
    icon: breakfastIcon,
    id: "breakfast",
}, {
    text: "Продкуты",
    icon: productsIcon,
    id: "products",
}, {
    text: "Вегетарианское",
    icon: vegetarianIcon,
    id: "vegetarian",
}];

export const payedRideItems: PayedRideItems[] = [{
    text: "Полная оплата проезда",
    icon: fullIcon,
    id: "full",
}, {
    text: "Компенсация строимостри проезда",
    icon: breakfastIcon,
    id: "partial",
}, {
    text: "Частичная компенсация затрат",
    icon: partPaymentIcon,
    id: "reimbursement",
}, {
    text: "Заброска из пункта сбора",
    icon: placeIcon,
    id: "pick-up",
}, {
    text: "Трансфер из/в аэропорта/вокзала",
    icon: transferIcon,
    id: "transfer",
}];

export const goodsItems: GoodsItems[] = [{
    text: "Горячая вода",
    icon: hotWaterIcon,
    id: "hot-water",
}, {
    text: "Интернет и wi-fi",
    icon: wiFiIcon,
    id: "wi-fi",
}, {
    text: "Электричество",
    icon: electricityIcon,
    id: "electicity",
}, {
    text: "Кондиционер",
    icon: airConditioningIcon,
    id: "conditioner",
}, {
    text: "Баня/сауна",
    icon: bathIcon,
    id: "bath",
}];

export const extraAvailiablesItems: ExtraAvailiablesItems[] = [{
    text: "Мастер-классы/ обучающие курсы",
    icon: classIcon,
    id: "master-class",
}, {
    text: "Экскурсии",
    icon: excursionsIcon,
    id: "excursions",
}, {
    text: "Катание на лошадях",
    icon: horsingIcon,
    id: "horses",
}, {
    text: "Языковые уроки",
    icon: languageIcon,
    id: "languages",
}, {
    text: "Другое",
    icon: otherIcon,
    id: "additional",
}];
