import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import { IButtonProps } from "@/components/ui/Button/Button.interface";

import styles from "./Button.module.scss";

const Button: FC<PropsWithChildren<IButtonProps>> = ({
    variant,
    rounded,
    className,
    children,
    ...restBtnProps
}) => {
    return (
        <button
            className={cn(
                styles.btn,
                {
                    [styles.primary]: variant === "PRIMARY",
                    [styles.secondary]: variant === "SECONDARY",
                    [styles.outlined]: variant === "OUTLINED",
                    [styles.green]: variant === "GREEN",
                    [styles.black]: variant === "BLACK",
                    [styles.gray]: variant === "GRAY",
                },
                {
                    [styles.rounded]: rounded,
                },
                className,
            )}
            {...restBtnProps}
            onClick={restBtnProps.onClick}
        >
            {children}
        </button>
    );
};

export default Button;
