import cn from "classnames";
import { FC, useState } from "react";

import styles from "./SideMenu.module.scss";
import SideMenuArrow from "./SideMenuArrow/SideMenuArrow";
import SideMenuNavbar from "./SideMenuNavbar/SideMenuNavbar";
import { ISideMenu } from "./types/SideMenu.interface";

const SideMenu: FC<ISideMenu> = ({ theme, content }) => {
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <nav
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
                <SideMenuNavbar
                    theme={theme}
                    content={content}
                    isOpen={isOpen}
                />
                <SideMenuArrow
                    theme={theme}
                    isOpen={isOpen}
                    setOpened={setOpen}
                />
            </nav>
        </>
    );
};

export default SideMenu;
