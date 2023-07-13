export interface DropdownItem {
    text: string;
    route: string;
}

export interface SidebarContentProps {
    text: string;
    icon: string;
    route: string;
    dropdownItems?: DropdownItem[];
}
