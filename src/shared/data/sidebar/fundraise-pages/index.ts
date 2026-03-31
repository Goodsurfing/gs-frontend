import { useTranslation } from "react-i18next";

import backIcon from "@/shared/assets/icons/navbar/offers/back.svg";
import calendarIcon from "@/shared/assets/icons/navbar/offers/calendar.svg";
import checklistIcon from "@/shared/assets/icons/navbar/offers/checklist.svg";
import pinIcon from "@/shared/assets/icons/navbar/offers/pin.svg";
import viewListIcon from "@/shared/assets/icons/navbar/offers/view-list.svg";
import writeIcon from "@/shared/assets/icons/navbar/offers/writing-fluently.svg";

import { SidebarContentProps } from "@/widgets/Sidebar";

export const useFundraiseSideMenuData = () => {
    const { t } = useTranslation("translation");

    const SideMenuData: SidebarContentProps[] = [
        {
            text: t("main.sidebar.К сборам"),
            icon: backIcon,
            route: "/host/donations",
        },
        {
            text: t("main.sidebar.Где"),
            icon: pinIcon,
            route: "/fundraise/where",
        },
        {
            text: t("main.sidebar.Когда"),
            icon: calendarIcon,
            route: "/fundraise/when",
        },
        {
            text: t("main.sidebar.Сколько"),
            icon: viewListIcon,
            route: "/fundraise/amount",
        },
        {
            text: t("main.sidebar.Описание"),
            icon: checklistIcon,
            route: "/fundraise/description",
        },
        {
            text: t("main.sidebar.Настройка автоматических сообщений"),
            icon: writeIcon,
            route: "/fundraise/auto-messages",
        },
    ];

    return { SideMenuData };
};
