import antonImage from "@/shared/assets/images/our-team/anton.png";
import pavelImage from "@/shared/assets/images/our-team/pavel.png";
import olgaImage from "@/shared/assets/images/our-team/olga.png";
import catherineImage from "@/shared/assets/images/our-team/сatherine.png";
import dmitryImage from "@/shared/assets/images/our-team/dmitry.png";
import milanaImage from "@/shared/assets/images/our-team/milana.png";

export interface AmbassadorsData {
    image: string;
    name: string;
    description: string;
    address: string;
}

export const ambassadorsData: AmbassadorsData[] = [
    {
        image: antonImage,
        name: "Антон Юрманов",
        description: "Экспедиционный центр Министерства обороны РФ",
        address: "Москва, Россия",
    },
    {
        image: pavelImage,
        name: "Павел Старовойтов",
        description: "Русское Географическое Общество",
        address: "Москва, Россия",
    },
    {
        image: olgaImage,
        name: "Ольга Химченко",
        description: "Русское Географическое Общество",
        address: "Москва, Россия",
    },
    {
        image: catherineImage,
        name: "Екатерина Туранова",
        description: "Проект «WildCamp: Национальные парки России»",
        address: "Москва, Россия",
    },
    {
        image: dmitryImage,
        name: "Дмитрий Иоффе",
        description: "Проект «Чистые игры»",
        address: "Санкт-Петербург, Россия",
    },
    {
        image: milanaImage,
        name: "Милана Фурман",
        description: "Клуб международного взаимодействия Passage Zebra",
        address: "Воронеж, Россия",
    },
];
