import React, { ButtonHTMLAttributes, FC } from "react";
import cn from "classnames";
import styles from "./SquareButton.module.scss";

interface SquareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export const SquareButton: FC<SquareButtonProps> = (props) => {
    const { className, children, ...rest } = props;
    return (
        <button type="button" className={cn(styles.wrapper, className)} {...rest}>{children}</button>
    );
};
