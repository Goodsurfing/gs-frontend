import React from "react";

import { useTranslation } from "react-i18next";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./Header.module.scss";

export const Header = () => {
    const { t } = useTranslation("find-job");
    const { locale } = useLocale();

    return (
        <section className={styles.wrapeprImage}>
            <h1 className={styles.title}>{t("Совмещай работу и путешествие!")}</h1>
            <h2 className={styles.description}>
                {t("Выездная сезонная работа на море, в горах и на природе!")}
            </h2>
            <div className={styles.buttonPrice}>
                <ButtonLink
                    path={`/${locale}/offers-map?category=paid_work`}
                    type="primary"
                    size="MEDIUM"
                    className={styles.button}
                >
                    {t("Найти работу")}
                </ButtonLink>
            </div>
        </section>
    );
};
