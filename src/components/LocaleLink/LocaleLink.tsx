import React, { FC, MouseEventHandler, PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./LocaleLink.module.scss";

interface LocaleLinkProps {
    to: string;
    className?: string;
    replace?: boolean;
    onClick?: MouseEventHandler<HTMLAnchorElement>
}

const LocaleLink: FC<PropsWithChildren<LocaleLinkProps>> = ({
    to,
    replace,
    className,
    children,
    onClick,
}) => (
    <Link
        onClick={onClick}
        replace={replace}
        className={cn(styles.link, className)}
        to={to}
    >
        {children}
    </Link>
);

export default LocaleLink;
