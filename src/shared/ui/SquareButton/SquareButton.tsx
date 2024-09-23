import React, { ButtonHTMLAttributes, FC } from "react";
import cn from "classnames";
import styles from "./SquareButton.module.scss";

interface SquareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    isActive?: boolean;
}

export const SquareButton: FC<SquareButtonProps> = (props) => {
    const {
        className, isActive = false, children, ...rest
    } = props;
    return (
        <button
            type="button"
            className={cn(
                styles.button,
                { [styles.active]: isActive },
                className,
            )}
            {...rest}
        >
            {children}
        </button>
    );
};
