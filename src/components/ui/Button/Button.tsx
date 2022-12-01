import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import { IButtonProps } from "@/components/ui/Button/Button.interface";

import styles from "./Button.module.scss";

const Button: FC<PropsWithChildren<IButtonProps>> = ({
    type,
    className,
    children,
}) => {
    return (
        <button
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
        </button>
    );
};

export default Button;
