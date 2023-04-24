import plusIcon from "@assets/icons/plus-icon.svg";
import cn from "classnames";
import React, { FC } from "react";

import styles from "./DateAddButton.module.scss";
import { IDateAddButton } from "./types";

const DateAddButton: FC<IDateAddButton> = ({
    className,
    children,
    onClick = () => {},
    ...restBtnProps
}) => {
    const onBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onClick(e);
    }

    return (
        <button
            className={cn(styles.btn, className)}
            onClick={onBtnClick}
            {...restBtnProps}
        >
            <img src={plusIcon} alt="+" />
            {children}
        </button>
    );
};

export default DateAddButton;
