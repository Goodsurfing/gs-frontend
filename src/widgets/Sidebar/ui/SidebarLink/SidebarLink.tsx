import cn from "classnames";
import { memo } from "react";
import { NavLink, useParams } from "react-router-dom";

import { ReactSVG } from "react-svg";
import { useLocale } from "@/app/providers/LocaleProvider";

import { useSidebarContext } from "../SidebarContext/SidebarContext";
import styles from "./SidebarLink.module.scss";
import { isSidebarLinkBack } from "../../lib/isSidebarLinkBack";
import { localePrefix } from "@/shared/config/routes/localePath";

interface SidebarLinkProps {
    text: string;
    icon?: string;
    route: string;
}

export const SidebarLink = memo(({ icon, route, text }: SidebarLinkProps) => {
    const { isOpen } = useSidebarContext();
    const { locale } = useLocale();
    const { id } = useParams();
    const pathCheck = () => {
        if (id) {
            if (isSidebarLinkBack(route)) {
                return `${localePrefix(locale)}${route}`;
            } return `${localePrefix(locale)}${route}/${id}`;
        }
        return `${localePrefix(locale)}${route}`;
    };
    const path = pathCheck();

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
                {icon && (
                    <ReactSVG className={styles.img} src={icon} />
                )}
                <span className={cn(styles.text, { [styles.opened]: isOpen })}>
                    {text}
                </span>
            </NavLink>
        </li>
    );
});
