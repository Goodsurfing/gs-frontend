import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import { IButtonProps } from "@/components/ui/Button/Button.interface";

import styles from "./Button.module.scss";

const Button: FC<PropsWithChildren<IButtonProps>> = ({
    variant,
    className,
    children,
    ...rest
}) => {
    return (
        <button
            className={cn(
                styles.btn,
                {
                    [styles.primary]: variant === "primary",
                    [styles.secondary]: variant === "secondary",
                    [styles.outlined]: variant === "outlined",
                },
                className,
            )}
            onClick={rest.onClick}
        >
            {children}
        </button>
    );
};

export default Button;
