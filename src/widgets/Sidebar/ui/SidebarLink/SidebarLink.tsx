import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { useSidebarContext } from "../SidebarContext/SidebarContext";
import styles from "./SidebarLink.module.scss";

interface SidebarLinkProps {
    text: string;
    icon: string;
    route: string;
}

export const SidebarLink = memo(({ icon, route, text }: SidebarLinkProps) => {
    const { isOpen } = useSidebarContext();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { id } = useParams();

    const routeParts = route.split("/");
    if (routeParts[1] === "offers") {
        routeParts.splice(2, 0, id);
    }
    const newRoute = routeParts.join("/");

    const path = `/${locale}${newRoute}`;

    return (
        <li className={styles.wrapper}>
            <NavLink
                to={path}
                replace
                className={({ isActive }) => cn(
                    styles.link,
                    { [styles.openedLink]: isOpen },
                    {
                        [styles.isActive]: isActive,
                    },
                )}
            >
                <img className={styles.img} src={icon} alt={text} />
                <span className={cn(styles.text, { [styles.opened]: isOpen })}>
                    {t(`main.sidebar.${text}`)}
                </span>
            </NavLink>
        </li>
    );
});
