import { useTranslation } from "react-i18next";
import backIcon from "@/shared/assets/icons/navbar/offers/back.svg";
import calendarIcon from "@/shared/assets/icons/navbar/offers/calendar.svg";
import checklistIcon from "@/shared/assets/icons/navbar/offers/checklist.svg";
import pinIcon from "@/shared/assets/icons/navbar/offers/pin.svg";
import rightUserIcon from "@/shared/assets/icons/navbar/offers/right-user.svg";
import viewListIcon from "@/shared/assets/icons/navbar/offers/view-list.svg";
import writeIcon from "@/shared/assets/icons/navbar/offers/writing-fluently.svg";
import listCheckboxIcon from "@/shared/assets/icons/navbar/offers/list-checkbox.svg";

import { SidebarContentProps } from "@/widgets/Sidebar";

export const useSideMenuData = () => {
    const { t } = useTranslation("translation");
    const SideMenuData: SidebarContentProps[] = [
        {
            text: t("main.sidebar.К предложениям"),
            icon: backIcon,
            route: "/host/my-offers",
        },
        {
            text: t("main.sidebar.Где"),
            icon: pinIcon,
            route: "/offers/where",
        },
        {
            text: t("main.sidebar.Когда"),
            icon: calendarIcon,
            route: "/offers/when",
        },
        {
            text: t("main.sidebar.Кто нужен"),
            icon: rightUserIcon,
            route: "/offers/who-needs",
        },
        {
            text: t("main.sidebar.Описание"),
            icon: checklistIcon,
            route: "/offers/description",
        },
        {
            text: t("main.sidebar.Что делать"),
            icon: viewListIcon,
            route: "/offers/what-to-do",
        },
        {
            text: t("main.sidebar.Условия"),
            icon: listCheckboxIcon,
            route: "/offers/conditions",
        },
        {
            route: "/offers/finishing-touches",
            text: t("main.sidebar.Последние штрихи"),
            icon: writeIcon,
        },
    ];
    return { SideMenuData };
};
