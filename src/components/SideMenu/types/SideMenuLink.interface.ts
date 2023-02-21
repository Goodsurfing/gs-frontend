import { Theme } from "./SideMenu.interface";

export interface ISideMenuLink {
    isOpen: boolean;
    theme: Theme;
    text: string;
    icon: string;
    route: string;
}