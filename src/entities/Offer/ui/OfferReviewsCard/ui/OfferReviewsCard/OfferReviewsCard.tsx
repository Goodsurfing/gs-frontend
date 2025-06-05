import React, {
    FC, memo, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ReviewWidget } from "@/widgets/ReviewWidget";

import { ApplicationReviewResponse, useGetToOrganizationsReviewsByIdQuery } from "@/entities/Review";
import { useLazyGetVolunteerByIdQuery } from "@/entities/Volunteer";

import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getFullName } from "@/shared/lib/getFullName";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./OfferReviewsCard.module.scss";

interface OfferReviewsCardProps {
    hostId: string;
    offerId: number;
}

export const OfferReviewsCard: FC<OfferReviewsCardProps> = memo(
    (props: OfferReviewsCardProps) => {
        const { hostId, offerId } = props;
        const { t } = useTranslation("offer");
        const [filteredReviews, setFilteredReviews] = useState<
        ApplicationReviewResponse[]
        >([]);
        const [visibleCount, setVisibleCount] = useState(5);
        const [renderCards, setRenderCards] = useState<JSX.Element[]>([]);
        const { locale } = useLocale();

        const { data: reviewsData } = useGetToOrganizationsReviewsByIdQuery(hostId);
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
                const cards = await Promise.all(
                    filteredReviews
                        .slice(0, visibleCount)
                        .map(async (review) => {
                            const {
                                stars,
                                text,
                                id,
                                volunteerAuthorId,
                                vacancyId,
                            } = review;
                            if (offerId === vacancyId) {
                                try {
                                    const volunteerData = await getVolunteer(
                                        volunteerAuthorId ?? "",
                                    ).unwrap();
                                    if (volunteerData) {
                                        const { profile } = volunteerData;
                                        const {
                                            image, firstName, lastName, id: profileId,
                                        } = profile;

                                        return (
                                            <ReviewWidget
                                                stars={stars}
                                                reviewText={text}
                                                avatar={getMediaContent(image)}
                                                name={getFullName(
                                                    firstName,
                                                    lastName,
                                                )}
                                                url={getVolunteerPersonalPageUrl(
                                                    locale,
                                                    profileId,
                                                )}
                                                key={id}
                                            />
                                        );
                                    }
                                } catch {
                                    return undefined;
                                }
                            }
                        }),
                );
                setRenderCards(
                    cards.filter((card) => card !== undefined) as JSX.Element[],
                );
            };

            fetchCards();
        }, [filteredReviews, visibleCount, getVolunteer, offerId, locale]);

        const handleShowNext = () => {
            setVisibleCount((prev) => prev + 5);
        };

        if (!reviewsData || reviewsData.length === 0) {
            return null;
        }

        return (
            <div className={styles.wrapper} id="review">
                <Text title={t("personalOffer.Отзывы")} titleSize="h3" />
                <div className={styles.container}>{renderCards.length > 0 ? renderCards : "На данный момент отзывов нет"}</div>
                {visibleCount < filteredReviews.length && (
                    <ShowNext onClick={handleShowNext} />
                )}
            </div>
        );
    },
);
