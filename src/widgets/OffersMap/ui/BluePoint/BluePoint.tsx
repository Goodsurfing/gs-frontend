import React, { FC } from "react";
import cn from "classnames";
import styles from "./BluePoint.module.scss";

interface BluePointProps {
    className?: string;
    isShow: boolean
}

export const BluePoint: FC<BluePointProps> = (props) => {
    const { className, isShow } = props;
    return (
        <div className={cn(styles.wrapper, className, { [styles.show]: isShow })} />
    );
};
