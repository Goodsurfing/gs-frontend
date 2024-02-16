import cn from "classnames";
import React, { FC } from "react";

import styles from "./ExtraCloseButton.module.scss";
import { ExtraCloseButtonProps } from "./types";

const ExtraCloseButton: FC<ExtraCloseButtonProps> = ({
    className,
    onClick,
    children,
    ...restBtnProps
}) => (
    <button
        onClick={onClick}
        type="button"
        className={cn(styles.btn, className)}
        {...restBtnProps}
    >
        {children}
    </button>
);

export default ExtraCloseButton;
