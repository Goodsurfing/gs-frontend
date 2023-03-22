export enum Theme {
    DARK = "DARK",
    LIGHT = "LIGHT",
}

export interface ISideMenu {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    theme: Theme;
    content: SideMenuParams[];
}

export interface SideMenuParams {
    text: string;
    icon: string;
    route: string;
    dropdownItems?: DropdownItem[];
}

export interface DropdownItem {
    text: string;
    route: string;
}
