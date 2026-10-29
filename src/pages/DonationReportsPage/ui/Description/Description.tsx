import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getNPOPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./Description.module.scss";

interface DescriptionProps {
    className?: string;
}

export const Description: FC<DescriptionProps> = (props: DescriptionProps) => {
    const { className } = props;
    const { t } = useTranslation("donation");
    const { locale } = useLocale();
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>
                {t("Гудсёрфинг — официально зарегистрированная некоммерческая организация, осуществляющая свою деятельность с 2018 года Ниже можно ознакомиться с соответствующими отчётами о деятельности и реквизитами организации")}
            </h2>
            <br />
            <p className={styles.title}>
                {t("Реквизиты организации")}
                :
            </p>
            <p className={styles.description}>
                Полное название: АВТОНОМНАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ
                «ИНФОРМАЦИОННЫЙ ЦЕНТР РАЗВИТИЯ ДОБРОВОЛЬЧЕСТВА «ГУДСЁРФИНГ – ДОБРЫЕ ПУТЕШЕСТВИЯ»
                <br />
                Сокращенное название: АНО «Гудсёрфинг»
                <br />
                Зарегистрирована 20 июля 2018 г. регистратором
                МЕЖРАЙОННАЯ ИНСПЕКЦИЯ ФЕДЕРАЛЬНОЙ НАЛОГОВОЙ СЛУЖБЫ № 18 ПО РЕСПУБЛИКЕ ТАТАРСТАН.
                <br />
                Руководитель организации: директор Попов Илья Александрович.
                <br />
                Юридический адрес: 420043, республика Татарстан, город Казань,
                Бойничная улица, дом 5, помещение 25.
                <br />
                Основным видом деятельности является «Деятельность по оказанию консультационных
                и информационных услуг», зарегистрировано 5 дополнительных видов деятельности.
                <br />
                Организации присвоены ИНН 1655405070, ОГРН 1181690059682,
                ОКПО 31801426.
                <br />
                support@goodsurfing.org
            </p>
            <br />
            <p className={styles.title}>
                {t("Банковские реквизиты")}
                :
            </p>
            <p className={styles.description}>
                Счёт (₽) 40703810207500000136
                <br />
                Банк получателя ТОЧКА ПАО БАНКА «ФК ОТКРЫТИЕ», г. Москва
                <br />
                БИК 044525999, Корр. Счёт 30101810845250000999
            </p>
            <br />
            {/* Годовые отчёты лежат на /npo — гость искал их здесь (аудит 29.10) */}
            <p className={styles.description}>
                {t("Годовые отчёты о деятельности и отчётность в Минюст —")}
                {" "}
                <Link to={getNPOPageUrl(locale)} className={styles.link}>
                    {t("на странице «О некоммерческой организации»")}
                </Link>
            </p>
        </section>
    );
};
