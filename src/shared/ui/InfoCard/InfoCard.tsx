import { memo, ReactNode } from "react";

import cn from "classnames";

import styles from "./InfoCard.module.scss";

interface InfoCardProps {
    className?: string;
    children: ReactNode;
}

export const InfoCard = memo((props: InfoCardProps) => {
    const { className, children } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            {children}
        </div>
    );
});
