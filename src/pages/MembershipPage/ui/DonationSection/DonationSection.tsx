import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getNPOPageUrl, getPaymentPageUrl } from "@/shared/config/routes/AppUrls";
import { TARIFF_CODE } from "@/shared/constants/membership";

import styles from "./DonationSection.module.scss";

interface DonationSectionProps {
    className?: string;
}

export const DonationSection: FC<DonationSectionProps> = ({ className }) => {
    const { t } = useTranslation("membership");
    const { locale } = useLocale();

    const fundsItems = [
        t("donation.funds-1", "Поддержку и развитие технологической части сервиса: работу сайта и технической инфраструктуры"),
        t("donation.funds-2", "Создание полезного контента и образовательных программ"),
        t("donation.funds-3", "Проведение мероприятий и поддержку сообщества"),
        t("donation.funds-4", "Запуск новых полезных инициатив для волонтёров и организаторов"),
        t("donation.funds-5", "Операционную работу организации"),
    ];

    const helpCards = [
        {
            color: styles.cardBlue,
            title: t("donation.help-1-title", "Распространение информации"),
            text: t("donation.help-1-text", "Поделитесь информацией о нашем проекте в своих социальных сетях, что поможет нам достичь большего числа людей."),
        },
        {
            color: styles.cardBlue,
            title: t("donation.help-2-title", "Корпоративное партнёрство"),
            text: t("donation.help-2-text", "Если ваша компания заинтересована в социальной ответственности, рассмотрите возможность стать нашим партнёром."),
        },
        {
            color: styles.cardGreen,
            title: t("donation.help-3-title", "Стать волонтёром"),
            text: t("donation.help-3-text", "Мы всегда рады людям, готовым поддержать нас своими действиями. Стать частью команды достаточно просто — напишите нам о своём желании в социальных сетях."),
        },
    ];

    return (
        <div id="support" className={cn(className, styles.wrapper)}>
            {/* Donation block */}
            <section className={styles.donationSection}>
                <div className={styles.inner}>
                    <div className={styles.left}>
                        <h2 className={styles.sectionTitle}>
                            {t("donation.title", "Поддержать Гудсёрфинг")}
                        </h2>
                        <p className={styles.subtitle}>
                            {t("donation.subtitle", "Разовый взнос любого размера помогает проекту жить и развиваться.")}
                        </p>
                        <Link
                            className={styles.btnDonate}
                            to={`${getPaymentPageUrl(locale)}?tariff=${TARIFF_CODE.VOLUNTEER}`}
                        >
                            {t("donation.cta", "Поддержать проект")}
                        </Link>
                    </div>
                    <div className={styles.right}>
                        <h3 className={styles.rightTitle}>
                            {t("donation.funds-title", "На что идут средства")}
                        </h3>
                        <p className={styles.fundsIntro}>
                            {t("donation.funds-intro", "Мы — некоммерческая организация, и наша главная цель — не получение прибыли, а развитие выездного добровольчества. Каждый рубль членских взносов идёт на:")}
                        </p>
                        <ul className={styles.fundsList}>
                            {fundsItems.map((item) => (
                                <li key={item} className={styles.fundsItem}>
                                    <span className={styles.fundsCheck}>✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.whyImportant}>
                            <p className={styles.whyText}>
                                {t("donation.why-p1", "Многие хотят, чтобы полезные социальные проекты существовали. Но такие проекты работают не сами по себе. За ними всегда стоит труд команды, цифровая инфраструктура и постоянное развитие.")}
                            </p>
                            <p className={styles.whyTextAccent}>
                                {t("donation.why-p2", "Ваша помощь делает Гудсёрфинг устойчивым, а не разовым энтузиастским проектом.")}
                            </p>
                            <Link className={styles.reportsLink} to={getNPOPageUrl(locale)}>
                                {t("donation.reports-link", "Публичная отчётность →")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How else to help */}
            <section className={styles.helpSection}>
                <div className={styles.helpInner}>
                    <h2 className={styles.helpTitle}>
                        {t("donation.help-title", "Как вы можете ещё помочь")}
                    </h2>
                    <div className={styles.helpCards}>
                        {helpCards.map((card) => (
                            <div key={card.title} className={cn(styles.helpCard, card.color)}>
                                <div className={styles.helpCardIcon}>+</div>
                                <h3 className={styles.helpCardTitle}>{card.title}</h3>
                                <p className={styles.helpCardText}>{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
