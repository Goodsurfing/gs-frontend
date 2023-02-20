import { DropdownItems } from "./SideMenu.interface";
import { Theme } from "./SideMenu.interface";

export interface ISideMenuDropdown {
    isOpen: boolean;
    setOpen: (opened: boolean) => void;
    theme: Theme;
    icon: string;
    text: string;
    dropdownItems: DropdownItems;
}