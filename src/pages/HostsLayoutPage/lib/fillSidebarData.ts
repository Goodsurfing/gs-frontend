import { TFunction } from "i18next";
import { SidebarContentProps } from "@/widgets/Sidebar";

export function FillSidebarData(sidebarContent: SidebarContentProps[], t: TFunction) {
    return sidebarContent.map((item) => {
        if (item.dropdownItems && item.route === "/host") {
            const newDropdownItem = {
                text: t("main.sidebar.Создать организацию"),
                route: "/registration",
            };
            return {
                ...item,
                dropdownItems: [newDropdownItem],
            };
        }
        return item;
    });
}
