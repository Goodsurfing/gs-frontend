import React, { FC } from "react";

import plusIcon from "@assets/icons/plus-icon.svg";
import cn from "classnames";

import { AddButtonProps } from "./types";

import styles from "./AddButton.module.scss";

const AddButton: FC<AddButtonProps> = ({
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

export default React.memo(AddButton);
