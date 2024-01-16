import React, { FC, memo } from "react";
import cn from "classnames";
import styles from "./Header.module.scss";

interface HeaderProps {
    className?: string;
}

const Header: FC<HeaderProps> = memo((props: HeaderProps) => {
    const { className } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <h1 className={styles.title}>
                ГудСёрфинг –
                путешествие со смыслом
            </h1>
        </div>
    );
});

export default Header;
