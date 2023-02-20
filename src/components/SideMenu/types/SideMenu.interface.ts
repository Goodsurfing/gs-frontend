export enum Theme {
    DARK = 'DARK',
    LIGHT = 'LIGHT'
}

export interface ISideMenu {
    theme: Theme;
    content: SideMenuContent;
}

export type SideMenuContent = SideMenuParams[];

type SideMenuParams = {
    text: string;
    icon: string;
    route?: string;
    dropdownItems?: DropdownItem[];
}

type DropdownItem = {
    text: string;
    route: string;
}

export type DropdownItems = DropdownItem[];