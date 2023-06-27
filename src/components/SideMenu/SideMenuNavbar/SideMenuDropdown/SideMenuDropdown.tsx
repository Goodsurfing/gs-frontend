import cn from "classnames";
import React, {
    FC, useEffect, useMemo, useState,
} from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";
import { ISideMenuDropdown } from "@/components/SideMenu/types/SideMenuDropdown.interface";

import compareRoutes from "@/shared/utils/routes/compareRoutes";

import styles from "./SideMenuDropdown.module.scss";

const SideMenuDropdown: FC<ISideMenuDropdown> = ({
    pathname,
    route,
    icon,
    isOpen,
    setOpen,
    text,
    dropdownItems,
    theme,
}) => {
    const [isDropdownOpened, setDropdownOpen] = useState(false);

    const isMatchRoute = compareRoutes(pathname, route);

    const dropdownClickHandler = () => {
        setOpen(true);
        setDropdownOpen(!isDropdownOpened);
    };

    const canOpen = isDropdownOpened && isOpen;

    useEffect(() => {
        setDropdownOpen(false);
    }, [isOpen]);

    return (
        <li onClick={dropdownClickHandler} className={styles.li}>
            <div
                className={cn(
                    styles.link,
                    {
                        [styles.dark]: theme === Theme.DARK,
                        [styles.light]: theme === Theme.LIGHT,
                    },
                    {
                        [styles.openedLink]: isOpen,
                    },
                )}
            >
                <img src={icon} alt={text} />
                <span
                    className={cn(
                        styles.text,
                        {
                            [styles.opened]: isOpen,
                        },
                        {
                            [styles.matchRoute]: isMatchRoute,
                        },
                    )}
                >
                    {text}
                </span>
            </div>
            {canOpen && (
                <div
                    className={cn(styles.dropdownContainer, {
                        [styles.dark]: theme === Theme.DARK,
                        [styles.light]: theme === Theme.LIGHT,
                    })}
                >
                    <div className={styles.dropdownLine} />
                    <div className={styles.dropdown}>
                        {dropdownItems.map((item) => {
                            const isMatchDropdownRoute = compareRoutes(
                                pathname,
                                item.route,
                            );
                            return (
                                <LocaleLink
                                    key={item.text}
                                    to={`${route}${item.route}`}
                                    className={cn(styles.dropdownItem, {
                                        [styles.activeRouteDropdown]:
                                            isMatchDropdownRoute,
                                    })}
                                >
                                    {item.text}
                                </LocaleLink>
                            );
                        })}
                    </div>
                </div>
            )}
        </li>
    );
};

export default SideMenuDropdown;