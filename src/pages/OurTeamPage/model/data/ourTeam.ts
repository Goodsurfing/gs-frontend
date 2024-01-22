import ilyaImage from "@/shared/assets/images/our-team/ilya.png";
import nargizImage from "@/shared/assets/images/our-team/nargiz.png";
import antonImage from "@/shared/assets/images/our-team/anton.png";
import pavelImage from "@/shared/assets/images/our-team/pavel.png";
import olgaImage from "@/shared/assets/images/our-team/olga.png";
import catherineImage from "@/shared/assets/images/our-team/сatherine.png";

export interface Founders {
    image: string;
    name: string;
    description: string;
    telegram: string;
    vk: string;
}

export interface GoodSurfingData {
    image: string;
    name: string;
    description: string;
    address: string;
}

export const foundersData: Founders[] = [
    {
        image: ilyaImage,
        name: "Илья Попов",
        description: "Сооснователь, управляющий",
        telegram: "",
        vk: "",
    },
    {
        image: nargizImage,
        name: "Наргиз Айтуганова",
        description: "Сооснователь",
        telegram: "",
        vk: "",
    },
];

export const goodSurfingData: GoodSurfingData[] = [
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
];
