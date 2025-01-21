import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ReviewFullCard } from "@/features/Review/";

import { ApplicationReviewResponse } from "@/entities/Review";
import { useGetToVolunteerReviewsByIdQuery } from "@/entities/Review/api/reviewApi";
import styles from "./ReviewAboutVolunteer.module.scss";

interface ReviewAboutVolunteerProps {
    volunteerId: string;
}

export const ReviewAboutVolunteer: FC<ReviewAboutVolunteerProps> = (props) => {
    const { volunteerId } = props;
    const { t } = useTranslation("volunteer");
    const { data: volunteerReviewsData } = useGetToVolunteerReviewsByIdQuery(volunteerId);
    const [reviews, setReviews] = useState<ApplicationReviewResponse[]>([]);

    useEffect(() => {
        if (volunteerReviewsData) {
            setReviews([...volunteerReviewsData]);
        } else {
            setReviews([]);
        }
    }, [volunteerReviewsData]);

    const renderCardOffers = (reviewOffers: ApplicationReviewResponse[]) => reviewOffers.map(
        (review) => <ReviewFullCard review={review} />,
    );

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>{t("volunteer-review.Отзывы о вас")}</h3>
            <div className={styles.cardContainer}>
                {renderCardOffers(reviews)}
            </div>
        </div>
    );
};
