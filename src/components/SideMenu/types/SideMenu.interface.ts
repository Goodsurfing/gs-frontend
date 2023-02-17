export type SideMenuContent = {  
    route: string;
    icon: string;
    text: string;
}

export enum Theme {
    DARK = 'DARK',
    LIGHT = 'LIGHT'
}

export interface ISideMenu {
    theme: Theme;
    content: SideMenuContent[]
}