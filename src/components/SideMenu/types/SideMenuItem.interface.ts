import { Theme } from "./SideMenu.interface";

export interface ISideMenuItem {
    isOpen: boolean;
    theme: Theme;
    route: string;
    icon: string;
    text: string;
}
