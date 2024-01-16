import hostelImage from "@/shared/assets/images/categories/1.png";
import reserveImage from "@/shared/assets/images/categories/2.png";
import farmImage from "@/shared/assets/images/categories/3.png";
import animalsImage from "@/shared/assets/images/categories/4.png";
import teachingImage from "@/shared/assets/images/categories/5.png";
import childrenImage from "@/shared/assets/images/categories/6.png";
import charityImage from "@/shared/assets/images/categories/7.png";
import sportImage from "@/shared/assets/images/categories/8.png";
import artImage from "@/shared/assets/images/categories/9.png";
import archeologyImage from "@/shared/assets/images/categories/10.png";
import onlineImage from "@/shared/assets/images/categories/11.png";

interface Categories {
    title: string;
    image?: string;
    numberVacancies: number;
}

export const categoriesData: Categories[] = [
    {
        title: "Работа в хостеле",
        image: hostelImage,
        numberVacancies: 9,
    },
    {
        title: "Заповедники и нац. парки",
        image: reserveImage,
        numberVacancies: 9,
    },
    {
        title: "Работа на ферме",
        image: farmImage,
        numberVacancies: 9,
    },
    {
        title: "Работа с животными",
        image: animalsImage,
        numberVacancies: 9,
    },
    {
        title: "Преподавание",
        image: teachingImage,
        numberVacancies: 9,
    },
    {
        title: "Работа с детьми",
        image: childrenImage,
        numberVacancies: 9,
    },
    {
        title: "Благотвори-тельность",
        image: charityImage,
        numberVacancies: 9,
    },
    {
        title: "Спорт",
        image: sportImage,
        numberVacancies: 9,
    },
    {
        title: "Искусство",
        image: artImage,
        numberVacancies: 9,
    },
    {
        title: "Археология",
        image: archeologyImage,
        numberVacancies: 9,
    },
    {
        title: "Онлайн",
        image: onlineImage,
        numberVacancies: 9,
    },
    {
        title: "Другое",
        numberVacancies: 9,
    },
];
