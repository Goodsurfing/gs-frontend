import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { mockedReviewVolunteers } from "../../model/data/mockedReviewData";
import { ReviewFullCard } from "@/features/Review/";
import { Review } from "@/types/review";
import styles from "./ReviewAboutVolunteer.module.scss";

export const ReviewAboutVolunteer: FC = () => {
    const { t } = useTranslation("volunteer");
    const renderCardOffers = (reviewOffers: Review[]) => reviewOffers
        .map((review) => (
            <ReviewFullCard review={review} />
        ));

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>{t("volunteer-review.Отзывы о вас")}</h3>
            <div className={styles.cardContainer}>{renderCardOffers(mockedReviewVolunteers)}</div>
        </div>
    );
};
