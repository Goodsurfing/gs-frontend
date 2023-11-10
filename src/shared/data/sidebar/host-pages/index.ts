import calendarIcon from "@/shared/assets/icons/navbar/calendar.svg";
import cityIcon from "@/shared/assets/icons/navbar/city.svg";
import globeIcon from "@/shared/assets/icons/navbar/globe.svg";
import houseIcon from "@/shared/assets/icons/navbar/home.svg";
import mailIcon from "@/shared/assets/icons/navbar/mail.svg";

import { SidebarContentProps } from "@/widgets/Sidebar";

export const HostPagesSidebarData: SidebarContentProps[] = [
    {
        route: "/host/host-dashboard",
        text: "Рабочий стол",
        icon: houseIcon,
    },
    {
        route: "/host/my-offers",
        text: "Предложения",
        icon: globeIcon,
    },
    {
        route: "/host/notes",
        text: "Заявки",
        icon: mailIcon,
    },
    {
        route: "/host/calendar",
        text: "Календарь",
        icon: calendarIcon,
    },
    {
        route: "/host",
        text: "Организация",
        icon: cityIcon,
        dropdownItems: [
            {
                text: "Описание",
                route: "/registration",
            },
            {
                text: "Фотогалерея",
                route: "/gallery",
            },
            {
                text: "Видеогалерея",
                route: "/video",
            },
            {
                text: "Команда",
                route: "/team",
            },
            {
                text: "Отзывы",
                route: "/review",
            },
        ],
    },
];
