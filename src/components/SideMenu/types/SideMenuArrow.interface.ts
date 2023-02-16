import { Theme } from "./SideMenu.interface";

export interface ISideMenuArrow {
    opened: boolean;
    theme: Theme;
    setOpened: (opened: boolean) => void;
}
