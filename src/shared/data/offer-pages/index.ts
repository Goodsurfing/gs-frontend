import backIcon from "@/shared/assets/icons/navbar/offers/back.svg";
import calendarIcon from "@/shared/assets/icons/navbar/offers/calendar.svg";
import checklistIcon from "@/shared/assets/icons/navbar/offers/checklist.svg";
import pinIcon from "@/shared/assets/icons/navbar/offers/pin.svg";
import rightUserIcon from "@/shared/assets/icons/navbar/offers/right-user.svg";
import viewListIcon from "@/shared/assets/icons/navbar/offers/view-list.svg";
import writeIcon from "@/shared/assets/icons/navbar/offers/writing-fluently.svg";
import listCheckboxIcon from "@/shared/assets/icons/navbar/offers/list-checkbox.svg";

import { SidebarContentProps } from "@/widgets/Sidebar";

export const SideMenuData: SidebarContentProps[] = [
    {
        text: "К предложениям",
        icon: backIcon,
        route: "/offers/welcome",
    },
    {
        text: "Где",
        icon: pinIcon,
        route: "/offers/where",
    },
    {
        text: "Когда",
        icon: calendarIcon,
        route: "/offers/when",
    },
    {
        text: "Кто нужен",
        icon: rightUserIcon,
        route: "/offers/who-needs",
    },
    {
        text: "Описание",
        icon: checklistIcon,
        route: "/offers/description",
    },
    {
        text: "Что делать",
        icon: viewListIcon,
        route: "/offers/what-to-do",
    },
    {
        text: "Условия",
        icon: listCheckboxIcon,
        route: "/offers/conditions",
    },
    {
        route: "/offers/last",
        text: "Последние штрихи",
        icon: writeIcon,
    },
];
