import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";
import { IButtonProps } from "@/shared/ui/ButtonLink/ButtonLink.interface";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import styles from "./ButtonLink.module.scss";

const ButtonLink: FC<PropsWithChildren<IButtonProps>> = ({
    type,
    path,
    className,
    children,
}) => {
    return (
        <LocaleLink
            to={path}
            className={cn(
                styles.btn,
                {
                    [styles.primary]: type === "primary",
                    [styles.secondary]: type === "secondary",
                    [styles.outlined]: type === "outlined",
                },
                className,
            )}
        >
            {children}
        </LocaleLink>
    );
};

export default ButtonLink;
