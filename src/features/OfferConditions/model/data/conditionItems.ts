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

export const liveItems = [{
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

export const foodItems = [{
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

export const payedRideItems = [{
    text: "Полная оплата проезда",
    icon: fullIcon,
    id: "",
}, {
    text: "Компенсация строимостри проезда",
    icon: breakfastIcon,
    id: "",
}, {
    text: "Частичная компенсация затрат",
    icon: partPaymentIcon,
    id: "",
}, {
    text: "Заброска из пункта сбора",
    icon: placeIcon,
    id: "",
}, {
    text: "Трансфер из/в аэропорта/вокзала",
    icon: transferIcon,
    id: "",
}];

export const goodsItems = [{
    text: "Горячая вода",
    icon: hotWaterIcon,
    id: "",
}, {
    text: "Интернет и wi-fi",
    icon: wiFiIcon,
    id: "",
}, {
    text: "Электричество",
    icon: electricityIcon,
    id: "",
}, {
    text: "Кондиционер",
    icon: airConditioningIcon,
    id: "",
}, {
    text: "Баня/сауна",
    icon: bathIcon,
    id: "",
}];

export const extraAvailiablesItems = [{
    text: "Мастер-классы/ обучающие курсы",
    icon: classIcon,
    id: "",
}, {
    text: "Экскурсии",
    icon: excursionsIcon,
    id: "",
}, {
    text: "Катание на лошадях",
    icon: horsingIcon,
    id: "",
}, {
    text: "Языковые уроки",
    icon: languageIcon,
    id: "",
}, {
    text: "Другое",
    icon: otherIcon,
    id: "",
}];
