import React, { FC, MouseEventHandler } from "react";

import cn from "classnames";

import Arrow from "@/shared/ui/Arrow/Arrow";

import { BluePoint } from "../BluePoint/BluePoint";
import styles from "./ButtonFilter.module.scss";

interface ButtonFilterProps {
    onClick: MouseEventHandler<HTMLDivElement>;
    isOpen: boolean;
    isShowBluePoint: boolean;
    text?: string;
}

export const ButtonFilter: FC<ButtonFilterProps> = (
    props,
) => {
    const {
        onClick, isOpen, text, isShowBluePoint,
    } = props;
    return (
        <div className={cn(styles.btn, { [styles.open]: isOpen })} onClick={onClick}>
            <div className={styles.inner}>
                {text}
                <BluePoint
                    isShow={isShowBluePoint}
                    className={styles.bluePoint}
                />
            </div>
            <Arrow
                isOpen={isOpen}
                className={cn(styles.arrow, { [styles.open]: isOpen })}
            />

        </div>
    );
};
