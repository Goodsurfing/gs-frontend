import cn from "classnames";
import React, { FC } from "react";

import styles from "./HostProfileFillPoint.module.scss";

interface IHostProfileFillPoint {
    text: string;
    circleColor?: string;
    circleWidth?: string;
    className?: string;
}

const HostProfileFillPoint: FC<IHostProfileFillPoint> = ({
    text,
    circleColor,
    circleWidth = "12px",
    className,
}) => {
    return (
        <li className={cn(styles.pointWrapper, className)}>
            <div
                style={{
                    backgroundColor: circleColor,
                    width: circleWidth,
                    height: circleWidth,
                }}
                className={styles.circle}
            />
            <label className={styles.text}>{text}</label>
        </li>
    );
};

export default React.memo(HostProfileFillPoint);
