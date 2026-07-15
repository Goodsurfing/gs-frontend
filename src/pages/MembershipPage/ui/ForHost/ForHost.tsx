import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";

import styles from "./ForHost.module.scss";
import {
    getPaymentPageUrl,
    getSignUpPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetTariffsQuery } from "@/store/api/membershipApi";
import { TARIFF_CODE, TARIFF_FALLBACK_PRICE_RUB } from "@/shared/constants/membership";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import checkIcon from "@/shared/assets/images/membership/check.svg";

interface ForHostProps {
    className?: string;
}

export const ForHost: FC<ForHostProps> = (props: ForHostProps) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { isAuth } = useAuth();

    const { data: tariffs } = useGetTariffsQuery("HOST");
    const tariff = tariffs?.find((item) => item.code === TARIFF_CODE.HOST);
    const priceRub = tariff?.priceRub ?? TARIFF_FALLBACK_PRICE_RUB[TARIFF_CODE.HOST];

    const handleSignUp = () => {
        navigate(getSignUpPageUrl(locale));
    };

    const handleGetMembership = () => {
        navigate(`${getPaymentPageUrl(locale)}?tariff=${TARIFF_CODE.HOST}`);
    };

    const freeFeatures = [
        t("for-host.free-feature-1", "До 1 опубликованной вакансии в год"),
        t("for-host.free-feature-2", "Участвовать в онлайн-мероприятиях Гудсёрфинга"),
        t("for-host.free-feature-3", "Просматривать материалы Гудсёрфинг Академии"),
    ];

    const paidFeatures = [
        t("for-host.paid-feature-1", "Возможность публиковать неограниченное количество волонтёрских вакансий"),
        t("for-host.paid-feature-2", "Прямой доступ к активным и проверенным волонтёрам"),
        t("for-host.paid-feature-3", "Медиаподдержка проектов"),
        t("for-host.paid-feature-4", "Повышенное доверие и статус Партнёра Гудсёрфинга"),
        t("for-host.paid-feature-5", "Участие в закрытых мероприятиях и доступ к обучающим программам"),
        t("for-host.paid-feature-6", "Рекомендательные письма от Гудсёрфинга для ваших проектов"),
        t("for-host.paid-feature-7", "Персональная поддержка"),
        t("for-host.paid-feature-8", "Консультации по продвижению"),
        t("for-host.paid-feature-9", "Возможность открывать сборы пожертвований"),
    ];

    return (
        // id="host" — якорь на секцию членства организатора: ссылки с
        // рабочего стола хоста и с international-сайта ведут на /membership#host
        // (у ForVolunteer уже есть id="tariffs", у InternationalClub — id="international").
        <section id="host" className={cn(className, styles.wrapper)}>
            <div className={styles.inner}>
                <h2 className={styles.sectionTitle}>
                    {t("for-host.section-title", "Если вы — организатор, который создаёт возможности")}
                </h2>
                <div className={styles.cards}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                {t("for-host.Без членства")}
                            </h3>
                            <span className={styles.cardPrice}>
                                0
                                {" "}
                                <span className={styles.cardPriceUnit}>
                                    {t("for-host.price-unit", "руб/год")}
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
                                {t("for-host.Зарегистрироваться")}
                            </Button>
                        )}
                    </div>

                    <div className={cn(styles.card, styles.cardPaid)}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                {t("for-host.Членство")}
                            </h3>
                            <span className={styles.cardPrice}>
                                {priceRub.toLocaleString("ru-RU")}
                                {" "}
                                <span className={styles.cardPriceUnit}>
                                    {t("for-host.price-unit", "руб/год")}
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
                            {t("for-host.Получить членство")}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
