import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import { IButtonProps } from "@/components/ui/ButtonLink/ButtonLink.interface";

import styles from "./ButtonLink.module.scss";

const ButtonLink: FC<PropsWithChildren<IButtonProps>> = ({
    type,
    path,
    className,
    children,
}) => {
    return (
        <Link
            to={path}
            className={cn(
                styles.btn,
                {
                    [styles.primary]: type === "primary",
                    [styles.secondary]: type === "secondary",
                    [styles.outlined]: type === "outlined",
                },
                className
            )}
        >
            {children}
        </Link>
    );
};

export default ButtonLink;
