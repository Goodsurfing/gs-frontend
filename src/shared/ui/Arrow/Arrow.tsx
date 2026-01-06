import cn from "classnames";
import React, { FC } from "react";

import styles from "./Arrow.module.scss";

interface ArrowProps {
    isOpen: boolean;
    className?: string;
    classNameOpen?: string;
}

const Arrow: FC<ArrowProps> = ({ className, isOpen, classNameOpen }) => (
    <div
        className={cn(styles.arrow, className, {
            [styles.open]: isOpen,
        }, isOpen && classNameOpen)}
    />
);

export default Arrow;
