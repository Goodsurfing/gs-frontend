import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import styles from "./Description.module.scss";

interface DescriptionProps {
    className?: string;
}

export const Description: FC<DescriptionProps> = (props: DescriptionProps) => {
    const { className } = props;
    const { t } = useTranslation("npo");
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>
                {t("Гудсёрфинг – официально зарегистрированная")}
                <br />
                {t("некоммерческая организация")}
            </h2>
            <p className={styles.description}>
                {t("Реквизиты организации: АВТОНОМНАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ИНФОРМАЦИОННЫЙ ЦЕНТР РАЗВИТИЯ ДОБРОВОЛЬЧЕСТВА «ГУДСЁРФИНГ – ДОБРЫЕ ПУТЕШЕСТВИЯ»")}
                <br />
                <br />
                {t("АНО «Гудсёрфинг» зарегистрирована 20 июля 2018 г.")}
            </p>
        </section>
    );
};
