import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";

import { isCurrentPath } from "@/shared/lib/isCurrentPath";

import styles from "./NavMenuLink.module.scss";

interface NavMenuLinkProps {
    to: string;
    className?: string;
}

/**
 * Пункт меню: на своей же странице — не ссылка, а отметка «вы здесь»
 * (`aria-current="page"`; вид задаёт меню через `[aria-current="page"]`).
 */
export const NavMenuLink: FC<PropsWithChildren<NavMenuLinkProps>> = ({
    to,
    className,
    children,
}) => {
    const { pathname } = useLocation();

    if (isCurrentPath(pathname, to)) {
        return (
            <span className={cn(className, styles.current)} aria-current="page">
                {children}
            </span>
        );
    }

    return (
        <Link className={className} to={to}>
            {children}
        </Link>
    );
};
