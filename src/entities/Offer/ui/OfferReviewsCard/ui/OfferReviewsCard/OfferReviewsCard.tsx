import React, { FC, memo, useMemo } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { ReviewWidget } from "@/widgets/ReviewWidget";

import { Review } from "@/entities/Review";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./OfferReviewsCard.module.scss";

interface OfferReviewsCardProps {
    reviews: Review[];
}

export const OfferReviewsCard: FC<OfferReviewsCardProps> = memo(
    (props: OfferReviewsCardProps) => {
        const { reviews } = props;
        const { locale } = useLocale();
        const { t } = useTranslation("offer");

        const renderCards = useMemo(
            () => reviews
                .slice(0, 3)
                .map((review, index) => (
                    <ReviewWidget review={review} key={index} />
                )),
            [reviews],
        );

        return (
            <div className={styles.wrapper} id="review">
                <h3>{t("personalOffer.Отзывы")}</h3>
                <div className={styles.container}>{renderCards}</div>
                <Link className={styles.viewAll} to={getMainPageUrl(locale)}>
                    {t("personalOffer.Посмотреть все")}
                </Link>
            </div>
        );
    },
);
