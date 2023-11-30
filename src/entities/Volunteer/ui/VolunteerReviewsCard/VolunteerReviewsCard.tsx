import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Link } from "react-router-dom";
import { ReviewWidget } from "@/widgets/ReviewWidget";

import { Review } from "@/entities/Review";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import arrowDownIcon from "@/shared/assets/icons/arrow-down.svg";
import styles from "./VolunteerReviewsCard.module.scss";

interface VolunteerReviewsCardProps {
    reviews?: Review[];
    className?: string;
}

export const VolunteerReviewsCard: FC<VolunteerReviewsCardProps> = memo(
    (props: VolunteerReviewsCardProps) => {
        const { className, reviews } = props;
        const { locale } = useLocale();
        const renderCards = useMemo(
            () => {
                if (!reviews) {
                    return <span>У волонтёра пока нет отзывов</span>;
                }
                return reviews
                    .slice(0, 2)
                    .map((reviewItem, index) => (
                        <ReviewWidget review={reviewItem} key={index} />
                    ));
            },
            [reviews],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Отзывы о волонтёре</h3>
                <div className={styles.container}>{renderCards}</div>
                <Link to={getMainPageUrl(locale)} className={styles.ViewAll}>
                    Посмотреть все
                    {" "}
                    <img src={arrowDownIcon} alt="View all" />
                </Link>
            </div>
        );
    },
);
