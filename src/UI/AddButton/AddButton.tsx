import React, { FC } from "react";

import plusIcon from "@assets/icons/plus-icon.svg";
import plusWhiteIcon from "@assets/icons/plus-white-icon.svg";

import cn from "classnames";

import { AddButtonProps } from "./types";

import styles from "./AddButton.module.scss";

const AddButton: FC<AddButtonProps> = ({
    className,
    children,
    onClick = () => {},
    disabled,
    ...restBtnProps
}) => {
    const onBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onClick(e);
    };

    return (
        <button
            className={cn(styles.btn, className, {
                [styles.disabled]: disabled,
            })}
            onClick={onBtnClick}
            {...restBtnProps}
        >
            <img src={disabled ? plusIcon : plusWhiteIcon} alt="+" />
            {children}
        </button>
    );
};

export default React.memo(AddButton);
