import { memo } from "react";
import cn from "classnames";

import { NavLink } from "react-router-dom";
import styles from "./SidebarLink.module.scss";
import { useSidebarContext } from "../SidebarContext/SidebarContext";
import { useLocale } from "@/app/providers/LocaleProvider";

interface SidebarLinkProps {
    text: string;
    icon: string;
    route: string;
}

export const SidebarLink = memo(({
    icon, route, text,
}: SidebarLinkProps) => {
    const { isOpen } = useSidebarContext();
    const { locale } = useLocale();
    return (
        <li className={styles.wrapper}>
            <NavLink
                to={`/${locale}${route}`}
                replace
                className={({ isActive }) => (cn(styles.link, {
                    [styles.openedLink]: isOpen,
                    [styles.activeLink]: isActive,
                }))}
            >
                <img className={styles.img} src={icon} alt={text} />
                <span className={cn(styles.text, { [styles.opened]: isOpen })}>
                    {text}
                </span>
            </NavLink>
        </li>
    );
});
