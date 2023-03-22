import calendarIcon from "@assets/icons/navbar/calendar.svg";
import cityIcon from "@assets/icons/navbar/city.svg";
import globeIcon from "@assets/icons/navbar/globe.svg";
import homeIcon from "@assets/icons/navbar/home.svg";
import mailIcon from "@assets/icons/navbar/mail.svg";
import React from "react";

import { SideMenuParams } from "@/components/SideMenu/types/SideMenu.interface";

export const SideMenuData: SideMenuParams[] = [
    {
        text: "Рабочий стол",
        icon: homeIcon,
        route: "/",
    },
    {
        text: "Предложения",
        icon: globeIcon,
        route: "/",
    },
    {
        text: "Заявки",
        icon: mailIcon,
        route: "/",
    },
    {
        text: "Календарь",
        icon: calendarIcon,
        route: "/",
    },
    {
        route: "",
        text: "Организация",
        icon: cityIcon,
        dropdownItems: [
            {
                text: "Описание",
                route: "/",
            },
            {
                text: "Фотогалерея",
                route: "/",
            },
            {
                text: "Видеогалерея",
                route: "/",
            },
            {
                text: "Команда",
                route: "/",
            },
            {
                text: "Отзывы",
                route: "/",
            },
        ],
    },
];
