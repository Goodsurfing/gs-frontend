import cn from "classnames";
import { ReactNode, memo } from "react";

import styles from "./InfoCard.module.scss";

interface InfoCardItemProps {
    className?: string;
    title?: string;
    text?: string | number;
    children?: ReactNode;
}

interface InfoCardProps {
    className?: string;
    children?: ReactNode;
}

export const InfoCardItem = memo((props: InfoCardItemProps) => {
    const {
        className, title, text, children,
    } = props;
    return (
        <div className={cn(styles.infoCardItem, className)}>
            <span className={styles.title}>{title}</span>
            {text && (
                <span className={styles.text}>{text}</span>
            )}
            {children}
        </div>
    );
});

export const InfoCard = memo((props: InfoCardProps) => {
    const { className, children } = props;
    return <div className={cn(className, styles.wrapper)}>{children}</div>;
});
