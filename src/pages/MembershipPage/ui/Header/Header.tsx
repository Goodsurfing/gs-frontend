import React from "react";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";
import styles from "./Header.module.scss";

export const Header = () => {
    const { t } = useTranslation("membership");
    return (
        <section className={styles.wrapeprImage}>
            <h1 className={styles.title}>
                <span>{t("Оформи членство Гудсёрфинга")}</span>
                <br />
                <span>{t("header.и открой для себя бескрайний мир")}</span>
                <br />
                <span>{t("header.путешествий со смыслом!")}</span>
            </h1>
            <ul className={styles.list}>
                <li>{t("header.Неограниченный доступ ко всем направлениям и видам путешествий")}</li>
                <li>{t("header.Прямое общение с хостом")}</li>
                <li>{t("header.Поддержка в путешествиях со стороны Гудсёрфинга")}</li>
                <li>{t("header.Доступ к образовательным материалам")}</li>
                <li>{t("header.Поддержка интересного и важного проекта")}</li>
            </ul>
            <div className={styles.buttonPrice}>
                <Button color="GREEN" size="SMALL" variant="FILL">{t("header.Получить членство")}</Button>
                <span className={styles.price}>1 500 руб</span>
            </div>
        </section>
    );
};
