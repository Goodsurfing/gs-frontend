import { SideMenuContent, Theme } from "./SideMenu.interface";

export interface ISideMenuNavbar {
    content: SideMenuContent[];
    theme: Theme;
    isOpen: boolean;
}