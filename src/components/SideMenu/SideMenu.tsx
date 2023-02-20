import cn from "classnames";
import { FC, useState } from "react";

import styles from "./SideMenu.module.scss";
import SideMenuArrow from "./SideMenuArrow/SideMenuArrow";
import SideMenuNavbar from "./SideMenuNavbar/SideMenuNavbar";
import { ISideMenu, Theme } from "./types/SideMenu.interface";

const SideMenu: FC<ISideMenu> = ({ theme, content, children }) => {
    const [isOpen, setOpen] = useState(false);
    return (
        <nav
            className={cn(
                styles.sideMenu,
                {
                    [styles.dark]: theme === Theme.DARK,
                    [styles.white]: theme === Theme.LIGHT,
                },
                {
                    [styles.open]: isOpen,
                }
            )}
        >
            <SideMenuNavbar
                theme={theme}
                content={content}
                isOpen={isOpen}
                setOpen={setOpen}
                children={children}
            />
            <SideMenuArrow theme={theme} isOpen={isOpen} setOpen={setOpen} />
        </nav>
    );
};

export default SideMenu;
