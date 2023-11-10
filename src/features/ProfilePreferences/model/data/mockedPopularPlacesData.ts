import acrossRussia1 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/1.png";
import acrossRussia2 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/2.png";
import acrossRussia3 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/3.png";
import acrossRussia4 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/4.png";
import acrossRussia5 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/5.png";
import acrossRussia6 from "@/shared/assets/images/popular-places/profile-preferences/across-russia/6.png";
import acivityImage1 from "@/shared/assets/images/popular-places/profile-preferences/activity/1.png";
import acivityImage2 from "@/shared/assets/images/popular-places/profile-preferences/activity/2.png";
import acivityImage3 from "@/shared/assets/images/popular-places/profile-preferences/activity/3.png";
import acivityImage4 from "@/shared/assets/images/popular-places/profile-preferences/activity/4.png";
import acivityImage5 from "@/shared/assets/images/popular-places/profile-preferences/activity/5.png";
import acivityImage6 from "@/shared/assets/images/popular-places/profile-preferences/activity/6.png";
import acivityImage7 from "@/shared/assets/images/popular-places/profile-preferences/activity/7.png";
import acivityImage8 from "@/shared/assets/images/popular-places/profile-preferences/activity/8.png";
import acivityImage9 from "@/shared/assets/images/popular-places/profile-preferences/activity/9.png";
import acivityImage10 from "@/shared/assets/images/popular-places/profile-preferences/activity/10.png";
import acivityImage11 from "@/shared/assets/images/popular-places/profile-preferences/activity/11.png";
import acivityImage12 from "@/shared/assets/images/popular-places/profile-preferences/activity/12.png";
import acivityImage13 from "@/shared/assets/images/popular-places/profile-preferences/activity/13.png";
import popularPlace1 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/1.png";
import popularPlace2 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/2.png";
import popularPlace3 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/3.png";
import popularPlace4 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/4.png";
import popularPlace5 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/5.png";
import popularPlace6 from "@/shared/assets/images/popular-places/profile-preferences/popular-places/6.png";

import { PreferenceCategory } from "../types/profilePreferences";

export const popularPlacesData: PreferenceCategory[] = [
    {
        id: 1,
        title: "Латинская Америка",
        image: popularPlace1,
        value: "latin_america",
    },
    {
        id: 2,
        title: "Европа",
        image: popularPlace2,
        value: "europe",
    },
    {
        id: 3,
        title: "Азия",
        image: popularPlace3,
        value: "asia",
    },
    {
        id: 4,
        title: "Африка",
        image: popularPlace4,
        value: "africa",
    },
    {
        id: 5,
        title: "Франция",
        image: popularPlace5,
        value: "france",
    },
    {
        id: 6,
        title: "Германия",
        image: popularPlace6,
        value: "germany",
    },
];

export const acrossRussiaData: PreferenceCategory[] = [
    {
        id: 1,
        title: "Алтай",
        image: acrossRussia1,
        value: "altai",
    },
    {
        id: 2,
        title: "Камчатка",
        image: acrossRussia2,
        value: "kamchatka",
    },
    {
        id: 3,
        title: "Крым",
        image: acrossRussia3,
        value: "crimea",
    },
    {
        id: 4,
        title: "Кавказ",
        image: acrossRussia4,
        value: "caucasus",
    },
    {
        id: 5,
        title: "Урал",
        image: acrossRussia5,
        value: "ural",
    },
    {
        id: 6,
        title: "Байкал",
        image: acrossRussia6,
        value: "baikal",
    },
];

export const activityData: PreferenceCategory[] = [
    {
        id: 1,
        title: "Работа в хостеле",
        image: acivityImage1,
        value: "work_in_hostel",
    },
    {
        id: 2,
        title: "Заповедники и нац.парки",
        image: acivityImage2,
        value: "reserves",
    },
    {
        id: 3,
        title: "Работа на ферме",
        image: acivityImage3,
        value: "farm",
    },
    {
        id: 4,
        title: "Работа с животными",
        image: acivityImage4,
        value: "work_with_animals",
    },
    {
        id: 5,
        title: "Преподавание",
        image: acivityImage5,
        value: "teaching",
    },
    {
        id: 6,
        title: "Работа с детьми",
        image: acivityImage6,
        value: "work_with_children",
    },
    {
        id: 7,
        title: "Благотворительность",
        image: acivityImage7,
        value: "charity",
    },
    {
        id: 8,
        title: "Спорт",
        image: acivityImage8,
        value: "sport",
    },
    {
        id: 9,
        title: "Искусство",
        image: acivityImage9,
        value: "art",
    },
    {
        id: 10,
        title: "Археология",
        image: acivityImage10,
        value: "archeology",
    },
    {
        id: 11,
        title: "Онлайн",
        image: acivityImage11,
        value: "online",
    },
    {
        id: 12,
        title: "Оплачиваемая работа",
        image: acivityImage12,
        value: "paid_work",
    },
    {
        id: 13,
        title: "Другое",
        image: acivityImage13,
        value: "other",
    },
];
