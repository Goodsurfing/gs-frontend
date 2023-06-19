import { SideMenuParams, Theme } from './SideMenu.interface';

export interface ISideMenuNavbar {
    pathname: string;
    content: SideMenuParams[];
    theme: Theme;
    isOpen: boolean;
    setOpen: (opened: boolean) => void;
}
