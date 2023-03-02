import cn from "classnames";
import React, { FC } from "react";

import styles from "./SideMenu.module.scss";
import SideMenuArrow from "./SideMenuArrow/SideMenuArrow";
import SideMenuNavbar from "./SideMenuNavbar/SideMenuNavbar";
import { ISideMenu, Theme } from "./types/SideMenu.interface";

const SideMenu: FC<ISideMenu> = ({ isOpen, setOpen, theme, content }) => {
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
            />
            <SideMenuArrow theme={theme} isOpen={isOpen} setOpen={setOpen} />
        </nav>
    );
};

export default React.memo(SideMenu);
