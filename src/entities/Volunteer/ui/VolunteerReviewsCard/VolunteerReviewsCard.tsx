import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { ReviewWidget } from "@/widgets/ReviewWidget";

import { useLazyGetHostByIdQuery } from "@/entities/Host";
import {
    ApplicationReviewResponse,
} from "@/entities/Review";

import { getHostPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./VolunteerReviewsCard.module.scss";
import { useGetToVolunteerReviewsQuery } from "@/entities/Review/api/reviewApi";

interface VolunteerReviewsCardProps {
    volunteerId: string;
    className?: string;
}

export const VolunteerReviewsCard: FC<VolunteerReviewsCardProps> = memo(
    (props: VolunteerReviewsCardProps) => {
        const { className, volunteerId } = props;
        const [filteredReviews, setFilteredReviews] = useState<
        ApplicationReviewResponse[]
        >([]);
        const [visibleCount, setVisibleCount] = useState(5);
        const [renderCards, setRenderCards] = useState<JSX.Element[]>([]);
        const { locale } = useLocale();
        const { t } = useTranslation("profile");

        const { data: reviewsData } = useGetToVolunteerReviewsQuery({ volunteer: volunteerId });
        const [getHost] = useLazyGetHostByIdQuery();

        useEffect(() => {
            if (reviewsData) {
                setFilteredReviews([...reviewsData]);
            } else {
                setFilteredReviews([]);
            }
        }, [reviewsData]);

        useEffect(() => {
            const fetchCards = async () => {
                const cards = await Promise.all(
                    filteredReviews
                        .slice(0, visibleCount)
                        .map(async (review) => {
                            const {
                                stars, text, id, organizationAuthorId,
                            } = review;
                            try {
                                const hostData = await getHost(
                                    organizationAuthorId ?? "",
                                ).unwrap();
                                if (hostData) {
                                    const {
                                        avatar,
                                        name,
                                        id: hostId,
                                    } = hostData;

                                    return (
                                        <ReviewWidget
                                            stars={stars}
                                            reviewText={text}
                                            avatar={getMediaContent(avatar)}
                                            name={name}
                                            url={getHostPersonalPageUrl(
                                                locale,
                                                hostId,
                                            )}
                                            key={id}
                                        />
                                    );
                                }
                            } catch {
                                return undefined;
                            }
                        }),
                );
                setRenderCards(
                    cards.filter((card) => card !== undefined) as JSX.Element[],
                );
            };

            fetchCards();
        }, [filteredReviews, visibleCount, locale, getHost]);

        const handleShowNext = () => {
            setVisibleCount((prev) => prev + 5);
        };

        if (!reviewsData || reviewsData.length === 0) {
            return null;
        }

        return (
            <div id="3" className={cn(className, styles.wrapper)}>
                <Text title={t("personal.Отзывы")} titleSize="h3" />
                <div className={styles.container}>{renderCards.length > 0 ? renderCards : t("personal.На данный момент отзывов нет")}</div>
                {visibleCount < filteredReviews.length && (
                    <ShowNext onClick={handleShowNext} />
                )}
            </div>
        );
    },
);
