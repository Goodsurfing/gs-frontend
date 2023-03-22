import { SideMenuParams } from "@/components/SideMenu/types/SideMenu.interface";

import calendarIcon from "@/assets/icons/navbar/calendar.svg";
import cityIcon from "@/assets/icons/navbar/city.svg";
import globeIcon from "@/assets/icons/navbar/globe.svg";
import houseIcon from "@/assets/icons/navbar/home.svg";
import mailIcon from "@/assets/icons/navbar/mail.svg";

export const HostPagesSidebarData: SideMenuParams[] = [
    {
        route: "/",
        text: "Рабочий стол",
        icon: houseIcon,
    },
    {
        route: "/",
        text: "Предложения",
        icon: globeIcon,
    },
    {
        route: "/",
        text: "Заявки",
        icon: mailIcon,
    },
    {
        route: "/",
        text: "Календарь",
        icon: calendarIcon,
    },
    {
        route: "host",
        text: "Организация",
        icon: cityIcon,
        dropdownItems: [
            {
                text: "Описание",
                route: "/registration",
            },
            {
                text: "Фотогалерея",
                route: "",
            },
            {
                text: "Видеогалерея",
                route: "",
            },
            {
                text: "Команда",
                route: "",
            },
            {
                text: "Отзывы",
                route: "",
            },
        ],
    },
];
