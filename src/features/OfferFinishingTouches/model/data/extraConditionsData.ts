import { ExtraConditions } from "@/entities/Offer";
import {
    adultsIcon,
    animalsIcon,
    kidsIcon,
    pairsIcon,
    studentsIcon,
    vegansIcon,
} from "@/shared/data/icons/finishingTouches";

export type ExtraConditionsData = {
    id: ExtraConditions;
    text: string;
    icon: string;
};

export const extraConditionsData: ExtraConditionsData[] = [{
    id: "allow-kids",
    icon: kidsIcon,
    text: "Можно с детьми",
}, {
    id: "allow-pets",
    icon: animalsIcon,
    text: "Можно с животными",
}, {
    id: "couples",
    icon: pairsIcon,
    text: "Принимаем парами",
}, {
    id: "students",
    icon: studentsIcon,
    text: "Можно студентам",
}, {
    id: "vegetarian",
    icon: vegansIcon,
    text: "Только для вегетарианцев",
}, {
    id: "adult-only",
    icon: adultsIcon,
    text: "Только для совершеннолетних",
}];
