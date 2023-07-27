import cn from "classnames";
import { memo } from "react";

import styles from "./Text.module.scss";

export type TextSize = "XL" | "X" | "M";

export type TitleSize = "XL" | "X" | "M";

export type TextStyle = "default";

interface TextProps {
    gap?: string | number;
    className?: string;
    title?: string;
    text?: string;
    titleSize?: TitleSize;
    textSize?: TextSize;
}

export const Text = memo(({
    className,
    text,
    gap,
    title,
    titleSize = "M",
    textSize = "M",
}: TextProps) => (
    <div
        style={{ gap }}
        className={cn(styles.wrapper, className, styles[textSize], styles[titleSize])}
    >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
    </div>
));
