import React from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";

interface HeaderProps {
    className?: string;
}

export const Header = (props: HeaderProps) => {
    const { className } = props;
    const { t } = useTranslation("donation");
    return (
        <section className={cn(className, styles.wrapper)}>
            <h1 className={styles.title}>{t("Публичная отчётность")}</h1>
        </section>
    );
};
