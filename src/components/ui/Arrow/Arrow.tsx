import cn from "classnames";
import React, { FC } from "react";

import styles from "./Arrow.module.scss";

interface ArrowProps {
    isOpen: boolean;
    className?: string;
}

const Arrow: FC<ArrowProps> = ({ className, isOpen }) => {
    return (
        <div
            className={cn(styles.arrow, className, {
                [styles.open]: isOpen,
            })}
        />
    );
};

export default Arrow;
