import cn from "classnames";
import { memo } from "react";

import styles from "./TextWithPoint.module.scss";

interface TextWithPointProps {
    text: string;
    active: boolean;
    circleClassName?: string;
    circleWidth?: string;
    className?: string;
}

export const TextWithPoint = memo(({
    text,
    active,
    circleClassName,
    circleWidth = "12px",
    className,
}: TextWithPointProps) => (
    <li className={cn(styles.pointWrapper, className)}>
        <div
            style={{
                width: circleWidth,
                height: circleWidth,
            }}
            className={cn(styles.circle, {
                [cn(styles.active, circleClassName)]: active,
            })}
        />
        <span className={styles.text}>{text}</span>
    </li>
));
