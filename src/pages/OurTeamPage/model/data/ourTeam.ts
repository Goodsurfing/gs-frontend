import ilyaImage from "@/shared/assets/images/our-team/ilya.png";
import nargizImage from "@/shared/assets/images/our-team/nargiz.png";
import pavelIvshinImage from "@/shared/assets/images/our-team/pavelIvshin.jpg";
import milanaImage from "@/shared/assets/images/our-team/milana1.jpg";
import victoriyaImage from "@/shared/assets/images/our-team/victoriya.jpg";
import apollinariyaImage from "@/shared/assets/images/our-team/apollinariya.jpg";
import kseniyaImage from "@/shared/assets/images/our-team/kseniya.jpg";

export interface Founders {
    image: string;
    name: string;
    description: string;
    telegram?: string;
    vk?: string;
}

export interface GoodSurfingData {
    image: string;
    name: string;
    description: string;
    address?: string;
    telegram?: string;
    vk?: string;
}

export const foundersData: Founders[] = [
    {
        image: ilyaImage,
        name: "Илья Попов",
        description: "Сооснователь, управляющий",
        telegram: "https://t.me/goodserfer",
        vk: "https://vk.com/popof",
    },
    {
        image: nargizImage,
        name: "Наргиз Айтуганова",
        description: "Сооснователь",
    },
];

export const goodSurfingData: GoodSurfingData[] = [
    {
        image: pavelIvshinImage,
        name: "Павел Ившин",
        description: "Начальник штаба",
        vk: "https://vk.com/chudo_vsyudu",
        telegram: "https://t.me/chudo_vsyudu",
    },
    {
        image: kseniyaImage,
        name: "Ксения Гущина",
        description: "Главный редактор",
        vk: "https://vk.com/wire_art",
        telegram: "https://t.me/five_oceans_of_the_earth",
    },
    {
        image: milanaImage,
        name: "Милана Фурман",
        description: "Координатор международных программ",
        vk: "https://vk.com/ngointeractionclub",
        telegram: "https://t.me/milanafurman",
    },
    {
        image: victoriyaImage,
        name: "Виктория Бирюкова",
        description: "Координатор международных программ ESC",
        vk: "https://vk.com/victoriabiryukova",
        telegram: "https://t.me/learn_volunteer_empower",
    },
    {
        image: apollinariyaImage,
        name: "Аполлинария Хотуницкая",
        description: "Координатор международных программ ESC",
        vk: "https://vk.com/victoriabiryukova",
        telegram: "https://t.me/Profolinaria",
    },
];
