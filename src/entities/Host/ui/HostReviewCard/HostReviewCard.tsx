import cn from "classnames";
import React, {
    FC, memo, useEffect,
    useState,
} from "react";

import { useTranslation } from "react-i18next";
import { ReviewWidget } from "@/widgets/ReviewWidget";

import { ApplicationReviewResponse, useGetToOrganizationsReviewsByIdQuery } from "@/entities/Review";
import styles from "./HostReviewCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useLazyGetVolunteerByIdQuery } from "@/entities/Volunteer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullName } from "@/shared/lib/getFullName";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Text } from "@/shared/ui/Text/Text";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";

interface HostReviewCardProps {
    hostId: string;
    className?: string;
}

export const HostReviewCard: FC<HostReviewCardProps> = memo(
    (props: HostReviewCardProps) => {
        const { className, hostId } = props;
        const { t } = useTranslation("host");
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
                            } = review;
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
                        }),
                );
                setRenderCards(
                    cards.filter((card) => card !== undefined) as JSX.Element[],
                );
            };

            fetchCards();
        }, [filteredReviews, visibleCount, getVolunteer, locale]);

        const handleShowNext = () => {
            setVisibleCount((prev) => prev + 5);
        };

        if (!reviewsData || reviewsData.length === 0) {
            return null;
        }

        return (
            <div id="6" className={cn(className, styles.wrapper)}>
                <Text title={t("personalHost.Отзывы")} titleSize="h3" />
                <div className={styles.container}>{renderCards}</div>
                {visibleCount < filteredReviews.length && (
                    <ShowNext onClick={handleShowNext} />
                )}
            </div>
        );
    },
);
