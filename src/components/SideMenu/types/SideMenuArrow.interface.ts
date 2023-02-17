import { Theme } from "./SideMenu.interface";

export interface ISideMenuArrow {
    isOpen: boolean;
    theme: Theme;
    setOpened: (isOpen: boolean) => void;
}
