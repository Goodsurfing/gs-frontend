import { memo, ButtonHTMLAttributes } from "react";

import cn from "classnames";
import plusIcon from "@/shared/assets/icons/plus-icon.svg";
import plusWhiteIcon from "@/shared/assets/icons/plus-white-icon.svg";

import styles from "./AddButton.module.scss";

interface AddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const AddButton = memo(({
    className,
    children,
    onClick,
    disabled,
    ...restBtnProps
}: AddButtonProps) => {
    const onBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onClick?.(e);
    };

    return (
        <button
            className={cn(styles.btn, className, {
                [styles.disabled]: disabled,
            })}
            onClick={onBtnClick}
            {...restBtnProps}
        >
            <img src={disabled ? plusIcon : plusWhiteIcon} alt="add" />
            {children}
        </button>
    );
});
