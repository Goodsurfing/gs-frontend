import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import { IButtonProps } from "@/components/ui/Button/Button.interface";

import styles from "./Button.module.scss";

const Button: FC<PropsWithChildren<IButtonProps>> = ({
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

export default Button;
