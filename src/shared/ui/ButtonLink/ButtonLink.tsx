import cn from "classnames";
import { MouseEventHandler, PropsWithChildren, memo } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import styles from "./ButtonLink.module.scss";

export interface ButtonLinkProps {
    type: "primary" | "secondary" | "outlined";
    size?: "LARGE" | "MEDIUM" | "SMALL" | "EXTRA-SMALL";
    path: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>
    target?: string;
}

const ButtonLink = memo(({
    type,
    size,
    path,
    className,
    children,
    onClick,
    target,
}: PropsWithChildren<ButtonLinkProps>) => (
    <LocaleLink
        onClick={onClick}
        to={path}
        className={cn(
            className,
            styles.btn,
            {
                [styles.primary]: type === "primary",
                [styles.secondary]: type === "secondary",
                [styles.outlined]: type === "outlined",
                ...(size && styles[size] ? { [styles[size]]: size } : {}),
                // [styles[size]]: size,
            },
        )}
        target={target}
    >
        {children}
    </LocaleLink>
));

export default ButtonLink;
