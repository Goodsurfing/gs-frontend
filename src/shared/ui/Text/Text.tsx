import cn from "classnames";
import { memo } from "react";

import styles from "./Text.module.scss";

export type TextSize = "primary" | "secondary";

export type TitleSize = "h1" | "h2" | "h3";

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
    titleSize = "h1",
    textSize = "primary",
}: TextProps) => (
    <div
        style={{ gap }}
        className={cn(styles.wrapper, className)}
    >
        <h3 className={cn(styles.title, styles[titleSize])}>{title}</h3>
        <p className={cn(styles.text, styles[textSize])}>{text}</p>
    </div>
));
