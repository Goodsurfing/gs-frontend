import cn from "classnames";
import React, { FC, useState } from "react";

import styles from "./SideMenu.module.scss";
import SideMenuArrow from "./SideMenuArrow/SideMenuArrow";
import { ISideMenu } from "./types/SideMenu.interface";

const SideMenu: FC<ISideMenu> = ({ theme, children }) => {
    const [isOpen, setOpen] = useState<boolean>(false);

    return (
        <aside
            className={cn(
                styles.sideMenu,
                {
                    [styles.dark]: theme === "DARK",
                    [styles.white]: theme === "LIGHT",
                },
                {
                    [styles.open]: isOpen,
                }
            )}
        >
            {children}
            <SideMenuArrow theme={theme} opened={isOpen} setOpened={setOpen} />
        </aside>
    );
};

export default SideMenu;
