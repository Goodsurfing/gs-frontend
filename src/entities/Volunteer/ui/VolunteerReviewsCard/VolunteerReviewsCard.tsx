import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Link } from "react-router-dom";
import { ReviewWidget } from "@/widgets/ReviewWidget";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import arrowDownIcon from "@/shared/assets/icons/arrow-down.svg";
import styles from "./VolunteerReviewsCard.module.scss";

interface VolunteerReviewsCardProps {
    volunteerId: string;
    className?: string;
}

export const VolunteerReviewsCard: FC<VolunteerReviewsCardProps> = memo(
    (props: VolunteerReviewsCardProps) => {
        const { className, volunteerId } = props;
        const { locale } = useLocale();

        const renderCards = useMemo(
            () => reviews
                .slice(0, 2)
                .map((reviewItem, index) => (
                    <ReviewWidget review={reviewItem} key={index} />
                )),
            [reviews],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Отзывы о волонтёре</h3>
                <div className={styles.container}>{renderCards}</div>

            </div>
        );
    },
);
