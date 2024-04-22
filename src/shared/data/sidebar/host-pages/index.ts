import { useTranslation } from "react-i18next";
import calendarIcon from "@/shared/assets/icons/navbar/calendar.svg";
import cityIcon from "@/shared/assets/icons/navbar/city.svg";
import globeIcon from "@/shared/assets/icons/navbar/globe.svg";
import houseIcon from "@/shared/assets/icons/navbar/home.svg";
import mailIcon from "@/shared/assets/icons/navbar/mail.svg";

import { SidebarContentProps } from "@/widgets/Sidebar";

export const useHostPagesSidebarData = () => {
    const { t } = useTranslation();
    const HostPagesSidebarData: SidebarContentProps[] = [
        {
            route: "/host/host-dashboard",
            text: t("main.sidebar.Рабочий стол"),
            icon: houseIcon,
        },
        {
            route: "/host/my-offers",
            text: t("main.sidebar.Предложения"),
            icon: globeIcon,
        },
        {
            route: "/host/notes",
            text: t("main.sidebar.Заявки"),
            icon: mailIcon,
        },
        {
            route: "/host/calendar",
            text: t("main.sidebar.Календарь"),
            icon: calendarIcon,
        },
        {
            route: "/host",
            text: t("main.sidebar.Организация"),
            icon: cityIcon,
            dropdownItems: [
                {
                    text: t("main.sidebar.Описание"),
                    route: "/registration",
                },
                {
                    text: t("main.sidebar.Фотогалерея"),
                    route: "/gallery",
                },
                {
                    text: t("main.sidebar.Видеогалерея"),
                    route: "/video",
                },
                {
                    text: t("main.sidebar.Команда"),
                    route: "/team",
                },
                {
                    text: t("main.sidebar.Отзывы"),
                    route: "/review",
                },
            ],
        },
    ];
    return { HostPagesSidebarData };
};
