import { Theme } from './SideMenu.interface';

export interface ISideMenuLink {
    pathname: string;
    isOpen: boolean;
    theme: Theme;
    text: string;
    icon: string;
    route: string;
}
