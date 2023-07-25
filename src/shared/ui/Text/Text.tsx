import cn from "classnames";
import { memo } from "react";

import styles from "./Text.module.scss";

interface TextProps {
    className?: string;
    title?: string;
    text?: string;
}

export type TextSize = "XL" | "X" | "M";

export type TitleSize = "XL" | "X" | "M";

export type TextStyle = "default";

export const Text = memo(({ className, text, title }: TextProps) => (
    <div className={cn(styles.wrapper, className)}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
    </div>
));
