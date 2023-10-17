import { SidebarContentProps } from "@/widgets/Sidebar";

export function fillSidebarData(sidebarContent: SidebarContentProps[]) {
    return sidebarContent.map((item) => {
        if (item.dropdownItems && item.route === "/host") {
            const newDropdownItem = {
                text: "Создать организацию",
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
