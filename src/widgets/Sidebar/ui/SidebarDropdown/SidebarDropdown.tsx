import { memo, useState } from "react";
import cn from "classnames";
import { NavLink, useLocation } from "react-router-dom";
import { DropdownItem } from "../../model/types/sidebar";
import { useSidebarContext } from "../SidebarContext/SidebarContext";
import compareRoutes from "@/shared/utils/routes/compareRoutes";

import styles from "./SidebarDropdown.module.scss";
import { useLocale } from "@/routes";

interface SidebarDropdownProps {
    route: string;
    icon: string;
    text: string;
    dropdownItems: DropdownItem[];
}

export const SidebarDropdown = memo(({
    dropdownItems, icon, route, text,
}: SidebarDropdownProps) => {
    const { locale } = useLocale();
    const { isOpen } = useSidebarContext();
    const [isDropdownOpened, setDropdownOpen] = useState(false);

    const { pathname } = useLocation();

    const isMatchRoutes = compareRoutes(pathname, route);

    const canOpen = isDropdownOpened && isOpen;

    return (
        <li className={styles.wrapper} onClick={() => setDropdownOpen(!isDropdownOpened)}>
            <div className={cn(styles.link, { [styles.linkOpen]: isOpen })}>
                <img className={styles.img} src={icon} alt={text} />
                <span className={cn(styles.text, {
                    [styles.opened]: isOpen,
                    [styles.matchRoute]: isMatchRoutes,
                })}
                >
                    {text}
                </span>
            </div>
            {canOpen && (
                <div className={styles.dropdownContainer}>
                    <div className={styles.dropdownLine} />
                    <div className={styles.dropdown}>
                        {dropdownItems.map((item) => (
                            <NavLink
                                key={item.text}
                                to={`/${locale}${route}${item.route}`}
                                replace
                                className={({ isActive }) => cn(styles.dropdownItem, {
                                    [styles.activeDropdownItem]: isActive,
                                })}
                            >
                                {item.text}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </li>
    );
});
