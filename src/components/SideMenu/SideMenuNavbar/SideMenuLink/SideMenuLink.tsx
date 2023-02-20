import cn from "classnames";
import { FC } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { Theme } from "../../types/SideMenu.interface";
import { ISideMenuLink } from "../../types/SideMenuLink.interface";
import styles from "./SideMenuLink.module.scss";

const SideMenuLink: FC<ISideMenuLink> = ({
    isOpen,
    theme,
    text,
    icon,
    route,
}) => {
    return (
        <li className={styles.li}>
            <LocaleLink
                to={route}
                className={cn(
                    styles.link,
                    {
                        [styles.dark]: theme === Theme.DARK,
                        [styles.light]: theme === Theme.LIGHT,
                    },
                    {
                        [styles.openedLink]: isOpen,
                    }
                )}
            >
                <img src={icon} alt={text} />
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

export default SideMenuLink;
