import cn from "classnames";
import React, { FC } from "react";

import styles from "./DateAddButton.module.scss";
import { IDateAddButton } from "./types";

const DateAddButton: FC<IDateAddButton> = ({ className, children, ...restBtnProps }) => {
    return (
        <button className={cn(styles.btn, className)} onClick={restBtnProps.onClick} {...restBtnProps}>
            {children}
        </button>
    );
};

export default DateAddButton;
