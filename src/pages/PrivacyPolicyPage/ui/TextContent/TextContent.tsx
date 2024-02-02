import cn from "classnames";
import React, { FC } from "react";

import styles from "./TextContent.module.scss";

interface TextContentProps {
    className?: string;
}

export const TextContent: FC<TextContentProps> = (props: TextContentProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content} id="1">
                <h2 className={styles.title}>1. Общие положения</h2>
                <p className={styles.description} />
            </div>
        </section>
    );
};
