import { Theme } from "./SideMenu.interface";

export interface ISideMenuArrow {
    isOpen: boolean;
    theme: Theme;
    setOpen: (isOpen: boolean) => void;
}
