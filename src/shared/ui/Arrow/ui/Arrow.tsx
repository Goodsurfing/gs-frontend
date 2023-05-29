import cn from "classnames";
import React, { FC, memo } from "react";

import styles from "./Arrow.module.scss";

interface ArrowProps {
    isOpen: boolean;
    className?: string;
}

const Arrow: FC<ArrowProps> = ({ className, isOpen }) => (
    <div
        className={cn(styles.arrow, className, {
          [styles.open]: isOpen,
        })}
    />
);

export const MemoArrow = memo(Arrow);
