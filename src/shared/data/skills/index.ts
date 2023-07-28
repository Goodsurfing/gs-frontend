import {
    adminIcon,
    artIcon,
    cookingIcon,
    decorIcon,
    driveIcon,
    farmingIcon,
    gardeningIcon,
    housekeepingIcon,
    musicIcon,
    nightJobIcon,
    photographyIcon,
    socialIcon,
    sportIcon,
    tourismIcon,
    videoIcon,
} from "../icons";

type SkillsData = {
    id:
    | "admin" | "cooking" | "driving" | "housing" | "decor"
    | "tourism" | "art" | "farming" | "social" | "recording" | "gardening"
    | "music" | "photo" | "night_job" | "sport";
    text: string;
    icon: string;
};

export const skillsData: SkillsData[] = [{
    id: "admin",
    icon: adminIcon,
    text: "Администрирование",
}, {
    id: "cooking",
    icon: cookingIcon,
    text: "Приготовление еды",
}, {
    id: "driving",
    icon: driveIcon,
    text: "Вождение",
}, {
    id: "housing",
    icon: housekeepingIcon,
    text: "Домоводство",
}, {
    id: "decor",
    icon: decorIcon,
    text: "Декорирование",
}, {
    id: "tourism",
    icon: tourismIcon,
    text: "Туристический гид",
}, {
    id: "art",
    icon: artIcon,
    text: "Исскуство",
}, {
    id: "farming",
    icon: farmingIcon,
    text: "Сельское хозяйство",
}, {
    id: "social",
    icon: socialIcon,
    text: "Социальная работа",
}, {
    id: "recording",
    icon: videoIcon,
    text: "Работа с видео",
}, {
    id: "gardening",
    icon: gardeningIcon,
    text: "Садоводство",
}, {
    id: "music",
    icon: musicIcon,
    text: "Музыка",
}, {
    id: "photo",
    icon: photographyIcon,
    text: "Фотография",
}, {
    id: "night_job",
    icon: nightJobIcon,
    text: "Ночная смена",
}, {
    id: "sport",
    icon: sportIcon,
    text: "Спорт",
}];
