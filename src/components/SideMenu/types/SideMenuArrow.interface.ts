export interface ISideMenuArrow {
    opened: boolean;
    theme: 'DARK' | 'LIGHT';
    setOpened: (opend: boolean) => void;
}
