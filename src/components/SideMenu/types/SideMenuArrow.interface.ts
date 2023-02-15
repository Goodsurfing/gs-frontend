interface ISideMenuArrow {
    opened: boolean;
    theme: 'DARK' | 'LIGHT';
    setOpened: (opeend: boolean) => void;
}

export { ISideMenuArrow }