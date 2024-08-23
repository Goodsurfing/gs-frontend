import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { ReviewWidget } from "@/widgets/ReviewWidget";

import { Review } from "@/entities/Review";
import styles from "./HostReviewCard.module.scss";

interface HostReviewCardProps {
    review: Review[];
    className?: string;
}

export const HostReviewCard: FC<HostReviewCardProps> = memo(
    (props: HostReviewCardProps) => {
        const { className, review } = props;
        const { t } = useTranslation("host");

        const renderCards = useMemo(
            () => review
                .slice(0, 2)
                .map((reviewItem, index) => (
                    <ReviewWidget review={reviewItem} key={index} />
                )),
            [review],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>{t("personalHost.Отзывы")}</h3>
                <div className={styles.container}>{renderCards}</div>
            </div>
        );
    },
);
