import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";

import styles from "./ForVolunteer.module.scss";
import {
    getPaymentPageUrl,
    getSignUpPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetTariffsQuery } from "@/store/api/membershipApi";
import { TARIFF_CODE, TARIFF_FALLBACK_PRICE_RUB } from "@/shared/constants/membership";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import checkIcon from "@/shared/assets/images/membership/check.svg";

interface ForVolunteerProps {
    className?: string;
}

export const ForVolunteer: FC<ForVolunteerProps> = (props: ForVolunteerProps) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { isAuth } = useAuth();

    const { data: tariffs } = useGetTariffsQuery("VOLUNTEER");
    const tariff = tariffs?.find((item) => item.code === TARIFF_CODE.VOLUNTEER);
    const priceRub = tariff?.priceRub ?? TARIFF_FALLBACK_PRICE_RUB[TARIFF_CODE.VOLUNTEER];

    const handleSignUp = () => {
        navigate(getSignUpPageUrl(locale));
    };

    const handleGetMembership = () => {
        navigate(`${getPaymentPageUrl(locale)}?tariff=${TARIFF_CODE.VOLUNTEER}`);
    };

    const freeFeatures = [
        t("for-volunteer.free-feature-1", "До 3 откликов в год — на разные волонтёрские вакансии"),
        t("for-volunteer.free-feature-2", "Участвовать в онлайн-мероприятиях Гудсёрфинга"),
        t("for-volunteer.free-feature-3", "Просматривать материалы Гудсёрфинг Академии"),
    ];

    const paidFeatures = [
        t("for-volunteer.paid-feature-1", "Неограниченный доступ к волонтёрским проектам и неограниченное количество откликов"),
        t("for-volunteer.paid-feature-2", "Приоритет при выборе участников проекта"),
        t("for-volunteer.paid-feature-3", "Доступ к закрытым образовательным материалам и мероприятиям"),
        t("for-volunteer.paid-feature-4", "Медиаподдержка волонтёра"),
        t("for-volunteer.paid-feature-5", "Повышенное доверие организатора (специальная метка в профиле)"),
        t("for-volunteer.paid-feature-6", "Возможность публиковаться в Сообществе"),
    ];

    return (
        <section id="tariffs" className={cn(className, styles.wrapper)}>
            <div className={styles.inner}>
                <h2 className={styles.sectionTitle}>
                    {t("for-volunteer.section-title", "Если вы — путешественник, который хочет менять мир")}
                </h2>
                <div className={styles.cards}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                {t("for-volunteer.Без членства")}
                            </h3>
                            <span className={styles.cardPrice}>
                                0
                                {" "}
                                <span className={styles.cardPriceUnit}>
                                    {t("for-volunteer.price-unit", "руб/год")}
                                </span>
                            </span>
                        </div>
                        <ul className={styles.featureList}>
                            {freeFeatures.map((feature) => (
                                <li key={feature} className={styles.featureItem}>
                                    <img
                                        className={cn(styles.checkIcon)}
                                        src={checkIcon}
                                        alt=""
                                        aria-hidden="true"
                                        width="20"
                                        height="20"
                                    />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        {!isAuth && (
                            <Button
                                color="BLUE"
                                size="SMALL"
                                variant="FILL"
                                className={styles.cardBtn}
                                onClick={handleSignUp}
                            >
                                {t("for-volunteer.Зарегистрироваться")}
                            </Button>
                        )}
                    </div>

                    <div className={cn(styles.card, styles.cardPaid)}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                {t("for-volunteer.Членство")}
                            </h3>
                            <span className={styles.cardPrice}>
                                {priceRub.toLocaleString("ru-RU")}
                                {" "}
                                <span className={styles.cardPriceUnit}>
                                    {t("for-volunteer.price-unit", "руб/год")}
                                </span>
                            </span>
                        </div>
                        <ul className={styles.featureList}>
                            {paidFeatures.map((feature) => (
                                <li key={feature} className={styles.featureItem}>
                                    <img
                                        className={cn(styles.checkIcon)}
                                        src={checkIcon}
                                        alt=""
                                        aria-hidden="true"
                                        width="20"
                                        height="20"
                                    />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button
                            color="GREEN"
                            size="SMALL"
                            variant="FILL"
                            className={styles.cardBtn}
                            onClick={handleGetMembership}
                        >
                            {t("for-volunteer.Получить членство")}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
