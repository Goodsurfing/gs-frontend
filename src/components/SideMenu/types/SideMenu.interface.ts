export enum Theme {
    DARK = "DARK",
    LIGHT = "LIGHT",
}

export interface ISideMenu {
    theme: Theme;
    content: SideMenuParams[];
}

export interface SideMenuParams {
    text: string;
    icon: string;
    route?: string;
    dropdownItems?: DropdownItem[];
}

export interface DropdownItem {
    text: string;
    route: string;
}
