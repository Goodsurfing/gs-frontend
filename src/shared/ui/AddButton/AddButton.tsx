import { memo, ButtonHTMLAttributes } from "react";

import cn from "classnames";
import plusIcon from "@/shared/assets/icons/plus-icon.svg";
import plusWhiteIcon from "@/shared/assets/icons/plus-white-icon.svg";

import styles from "./AddButton.module.scss";

interface AddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
}

export const AddButton = memo(({
    className,
    onClick,
    text,
    disabled,
    ...restBtnProps
}: AddButtonProps) => {
    const onBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onClick?.(e);
    };

    return (
        <button
            className={cn(className, styles.btn, {
                [styles.disabled]: disabled,
            })}
            type="button"
            onClick={onBtnClick}
            {...restBtnProps}
        >
            <img src={disabled ? plusWhiteIcon : plusIcon} alt="add" />
            <span className={styles.text}>{text}</span>
        </button>
    );
});
