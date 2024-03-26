import { FC, memo } from "react";
import cn from "classnames";
import styles from "./Header.module.scss";

interface HeaderProps {
    className?: string;
}

export const Header: FC<HeaderProps> = memo((props: HeaderProps) => {
    const { className } = props;

    return (
        <section className={cn(className, styles.wrapper)}>
            <h1 className={styles.title}>
                Журналы
            </h1>
        </section>
    );
});
