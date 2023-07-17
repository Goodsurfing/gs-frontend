import cn from "classnames";
import { PropsWithChildren, memo } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import styles from "./ButtonLink.module.scss";

export interface ButtonLinkProps {
    type: "primary" | "secondary" | "outlined";
    path: string;
    className?: string;
}

const ButtonLink = memo(({
    type,
    path,
    className,
    children,
}: PropsWithChildren<ButtonLinkProps>) => (
    <LocaleLink
        to={path}
        className={cn(
            className,
            styles.btn,
            {
                [styles.primary]: type === "primary",
                [styles.secondary]: type === "secondary",
                [styles.outlined]: type === "outlined",
            },
        )}
    >
        {children}
    </LocaleLink>
));

export default ButtonLink;
