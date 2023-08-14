import cn from "classnames";
import { ButtonHTMLAttributes, memo } from "react";

import IconComponent from "../IconComponent/IconComponent";

import styles from "./Button.module.scss";

export type ButtonVariant = "FILL" | "OUTLINE";

export type ButtonSize = "LARGE" | "MEDIUM" | "SMALL" | "EXTRA-SMALL";

export type ButtonColor = "BLUE" | "GREEN" | "GRAY" | "BLACK";

type ButtonBase = ButtonHTMLAttributes<HTMLButtonElement> & {
    color: ButtonColor;
    size: ButtonSize;
    variant: ButtonVariant;
    children: string;
};

type ButtonWithoutIcon = ButtonBase & {
    icon?: never;
    alt?: never;
};

type ButtonWithIcon = ButtonBase & {
    icon: string;
    alt: string;
};

const Button = memo((props: ButtonWithoutIcon | ButtonWithIcon) => {
    const {
        className,
        variant,
        color,
        size,
        children,
        icon,
        alt,
        ...restBtnProps
    } = props;
    return (
        <button
            type="button"
            className={cn(
                styles.btn,
                className,
                {
                    [styles[variant]]: variant,
                    [styles[color]]: color,
                    [styles[size]]: size,
                    [styles.withIcon]: icon,
                },
            )}
            {...restBtnProps}
        >
            <span className={styles.text}>{children}</span>
            {icon && (
                <IconComponent
                    alt={alt}
                    icon={icon}
                />
            )}
        </button>
    );
});

export default Button;
