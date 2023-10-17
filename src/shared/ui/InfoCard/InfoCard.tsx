import { memo, ReactNode } from "react";

import cn from "classnames";

import styles from "./InfoCard.module.scss";

interface InfoCardItemProps {
    className?: string;
    title: string;
    text: string | number;
}

interface InfoCardProps {
    className?: string;
    children?: ReactNode;
}

export const InfoCardItem = memo((props: InfoCardItemProps) => {
    const { className, title, text } = props;
    return (
        <div className={cn(styles.infoCardItem, className)}>
            <span className={styles.title}>{title}</span>
            <span className={styles.text}>{text}</span>
        </div>
    );
});

export const InfoCard = memo((props: InfoCardProps) => {
    const { className, children } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            {children}
        </div>
    );
});
