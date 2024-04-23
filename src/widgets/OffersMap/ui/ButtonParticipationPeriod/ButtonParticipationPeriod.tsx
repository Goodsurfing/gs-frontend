import React, { FC, MouseEventHandler } from "react";

import cn from "classnames";

import Arrow from "@/shared/ui/Arrow/Arrow";

import { BluePoint } from "../BluePoint/BluePoint";
import styles from "./ButtonParticipationPeriod.module.scss";

interface ButtonParticipationPeriodProps {
    onClick: MouseEventHandler<HTMLDivElement>;
    isOpen: boolean;
    value: number[];
}

export const ButtonParticipationPeriod: FC<ButtonParticipationPeriodProps> = (
    props,
) => {
    const { onClick, isOpen, value } = props;
    return (
        <div className={cn(styles.btn, { [styles.open]: isOpen })} onClick={onClick}>
            <div className={styles.inner}>
                Срок участия
                <BluePoint
                    isShow={!(value[0] === 7 && value[1] === 186)}
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
