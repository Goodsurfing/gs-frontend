import { Theme } from "./SideMenu.interface";

export interface ISideMenuItem {
    opened: boolean;
    theme: Theme;
    route: string;
    icon: string;
    text: string;
}
