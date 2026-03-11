import React from "react";
import cn from "classnames";
import styles from "./Header.module.scss";

interface HeaderProps {
    className?: string;
}

export const Header = (props: HeaderProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <h1 className={styles.title}>Публичная отчётность</h1>
        </section>
    );
};
