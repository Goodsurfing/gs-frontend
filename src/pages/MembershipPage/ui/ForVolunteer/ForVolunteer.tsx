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

interface ForVolunteerProps {
    className?: string;
}

const CheckIcon = ({ active }: { active?: boolean }) => (
    <svg
        className={cn(styles.checkIcon, { [styles.checkIconActive]: active })}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="10" cy="10" r="10" fill={active ? "#4CAF50" : "#B0BEC5"} />
        <path
            d="M5.5 10L8.5 13L14.5 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

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
                                    <CheckIcon active={false} />
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
                                    <CheckIcon active />
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
