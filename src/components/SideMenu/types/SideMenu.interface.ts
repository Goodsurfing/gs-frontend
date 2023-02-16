export type SideMenuContent = {  
    route: string;
    icon: string;
    text: string;
}

export type Theme = "DARK" | "LIGHT";

export interface ISideMenu {
    theme: Theme;
    content: SideMenuContent[]
}