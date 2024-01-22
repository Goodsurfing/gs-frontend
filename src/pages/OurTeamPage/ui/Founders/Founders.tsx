import React, { FC, memo, useMemo } from "react";
import cn from "classnames";
import styles from "./Founders.module.scss";

interface FoundersProps {
    className?: string;
}

export const Founders: FC<FoundersProps> = memo((props: FoundersProps) => {
    const { className } = props;
    const renderItems = useMemo(() => {}, []);
    return (
        <div className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>Основатели</h2>
            <div className={styles.container}>
                {renderItems}
            </div>
        </div>
    );
});
