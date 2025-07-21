/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    FC, memo, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ReviewWidget } from "@/widgets/ReviewWidget";

import { ApplicationReviewResponse, useGetToOrganizationsReviewsByIdQuery } from "@/entities/Review";
import { useLazyGetVolunteerByIdQuery } from "@/entities/Volunteer";

import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useGetFullName } from "@/shared/lib/getFullName";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./OfferReviewsCard.module.scss";

interface OfferReviewsCardProps {
    hostId: string;
    offerId: number;
}

const VISIBLE_COUNT = 5;

export const OfferReviewsCard: FC<OfferReviewsCardProps> = memo(
    (props: OfferReviewsCardProps) => {
        const { hostId, offerId } = props;
        const { t } = useTranslation("offer");
        const [filteredReviews, setFilteredReviews] = useState<ApplicationReviewResponse[]>([]);
        const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT);
        const [renderCards, setRenderCards] = useState<JSX.Element[]>([]);
        const { locale } = useLocale();
        const { getFullName } = useGetFullName();

        const { data: reviewsData } = useGetToOrganizationsReviewsByIdQuery({ hostId });
        const [getVolunteer] = useLazyGetVolunteerByIdQuery();

        useEffect(() => {
            if (reviewsData) {
                setFilteredReviews([...reviewsData]);
            } else {
                setFilteredReviews([]);
            }
        }, [reviewsData]);

        useEffect(() => {
            const fetchCards = async () => {
                const relevantReviews = filteredReviews.filter((r) => r.vacancyId === offerId);

                const cards = await Promise.all(
                    relevantReviews.slice(0, visibleCount).map(async (review) => {
                        const {
                            stars,
                            text,
                            id,
                            volunteerAuthorId,
                        } = review;

                        try {
                            const volunteerData = await getVolunteer(volunteerAuthorId ?? "").unwrap();

                            if (volunteerData) {
                                const { profile } = volunteerData;
                                const {
                                    image, firstName, lastName, id: profileId,
                                } = profile;

                                return (
                                    <ReviewWidget
                                        key={id}
                                        stars={stars}
                                        reviewText={text}
                                        avatar={getMediaContent(image)}
                                        name={getFullName(firstName, lastName)}
                                        url={getVolunteerPersonalPageUrl(locale, profileId)}
                                    />
                                );
                            }
                        } catch (err) {
                            return undefined;
                        }
                    }),
                );

                setRenderCards(cards.filter(Boolean) as JSX.Element[]);
            };

            fetchCards();
        }, [filteredReviews, offerId, visibleCount, locale]);

        const handleShowNext = () => {
            setVisibleCount((prev) => prev + VISIBLE_COUNT);
        };

        if (!reviewsData || reviewsData.length === 0) {
            return null;
        }

        return (
            <div className={styles.wrapper} id="review">
                <Text title={t("personalOffer.Отзывы")} titleSize="h3" />
                <div className={styles.container}>
                    {renderCards.length > 0
                        ? renderCards
                        : "На данный момент отзывов нет"}
                </div>
                {renderCards.length > 0 && visibleCount < filteredReviews.filter(
                    (r) => r.vacancyId === offerId,
                ).length && (
                    <ShowNext onClick={handleShowNext} />
                )}
            </div>
        );
    },
);
