import { FC, memo } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";

interface HeaderProps {
    className?: string;
}

export const Header: FC<HeaderProps> = memo((props: HeaderProps) => {
    const { className } = props;
    const { t } = useTranslation();

    return (
        <section className={cn(className, styles.wrapper)}>
            <h1 className={styles.title}>
                {t("Видео")}
            </h1>
        </section>
    );
});
