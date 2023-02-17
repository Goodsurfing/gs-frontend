import cn from "classnames";
import React, { FC } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { ISideMenuItem } from "../../types/SideMenuItem.interface";
import styles from "./SideMenuItem.module.scss";

const SideMenuItem: FC<ISideMenuItem> = ({
    isOpen,
    theme,
    route,
    icon,
    text,
}) => {
    return (
        <li className={styles.li}>
            <LocaleLink
                to={route}
                className={cn(styles.link, {
                    [styles.dark]: theme === "DARK",
                    [styles.light]: theme === "LIGHT",
                }, {
                   [styles.openedLink]: isOpen
                })}
            >
                <img className={styles.img} src={icon} alt={text + " icon"} />
                <span
                    className={cn(styles.text, {
                        [styles.opened]: isOpen,
                    })}
                >
                    {text}
                </span>
            </LocaleLink>
        </li>
    );
};

export default SideMenuItem;
