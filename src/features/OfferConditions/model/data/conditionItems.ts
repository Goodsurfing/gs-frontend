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
}, {
    text: "Завтрак включен",
    icon: breakfastIcon,
}, {
    text: "Продкуты",
    icon: productsIcon,
}, {
    text: "Вегетарианское",
    icon: vegetarianIcon,
}];

export const payedRideItems = [{
    text: "Полная оплата проезда",
    icon: fullIcon,
}, {
    text: "Компенсация строимостри проезда",
    icon: breakfastIcon,
}, {
    text: "Частичная компенсация затрат",
    icon: partPaymentIcon,
}, {
    text: "Заброска из пункта сбора",
    icon: placeIcon,
}, {
    text: "Трансфер из/в аэропорта/вокзала",
    icon: transferIcon,
}];

export const goodsItems = [{
    text: "Горячая вода",
    icon: hotWaterIcon,
}, {
    text: "Интернет и wi-fi",
    icon: wiFiIcon,
}, {
    text: "Электричество",
    icon: electricityIcon,
}, {
    text: "Кондиционер",
    icon: airConditioningIcon,
}, {
    text: "Баня/сауна",
    icon: bathIcon,
}];

export const extraAvailiablesItems = [{
    text: "Мастер-классы/ обучающие курсы",
    icon: classIcon,
}, {
    text: "Экскурсии",
    icon: excursionsIcon,
}, {
    text: "Катание на лошадях",
    icon: horsingIcon,
}, {
    text: "Языковые уроки",
    icon: languageIcon,
}, {
    text: "Другое",
    icon: otherIcon,
}];
