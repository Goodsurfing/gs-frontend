import cn from "classnames";
import React, {
    FC, memo, useEffect,
    useMemo,
    useState,
} from "react";

import { useTranslation } from "react-i18next";
import { ReviewWidget } from "@/widgets/ReviewWidget";

import { useGetToOrganizationsReviewsByIdQuery } from "@/entities/Review";
import styles from "./HostReviewCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useLazyGetVolunteerByIdQuery } from "@/entities/Volunteer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetFullName } from "@/shared/lib/getFullName";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Text } from "@/shared/ui/Text/Text";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";

interface HostReviewCardProps {
    hostId: string;
    className?: string;
}

export const HostReviewCard: FC<HostReviewCardProps> = memo((props: HostReviewCardProps) => {
    const { hostId, className } = props;
    const { t } = useTranslation("host");
    const { locale } = useLocale();
    const { getFullName } = useGetFullName();
    const { data: reviewsData = [] } = useGetToOrganizationsReviewsByIdQuery({ hostId });
    const [getVolunteer] = useLazyGetVolunteerByIdQuery();
    const [visibleCount, setVisibleCount] = useState(5);
    const [volunteerData, setVolunteerData] = useState<Record<string, any>>({});

    useEffect(() => {
        const fetchVolunteers = async () => {
            const newVolunteers = { ...volunteerData };
            let hasNewData = false;

            await Promise.all(
                reviewsData.slice(0, visibleCount).map(async (review) => {
                    const { volunteerAuthorId } = review;
                    if (volunteerAuthorId && !newVolunteers[volunteerAuthorId]) {
                        try {
                            const volunteer = await getVolunteer(volunteerAuthorId).unwrap();
                            newVolunteers[volunteerAuthorId] = volunteer;
                            hasNewData = true;
                        } catch (error) { /* empty */ }
                    }
                }),
            );

            if (hasNewData) {
                setVolunteerData(newVolunteers);
            }
        };

        fetchVolunteers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewsData, visibleCount, getVolunteer]);

    const handleShowNext = () => {
        setVisibleCount((prev) => prev + 5);
    };

    const renderCards = useMemo(() => reviewsData.slice(0, visibleCount).map((review) => {
        const {
            id, stars, text, volunteerAuthorId,
        } = review;

        if (!volunteerAuthorId || !volunteerData[volunteerAuthorId]) {
            return null;
        }

        const { profile } = volunteerData[volunteerAuthorId];
        return (
            <ReviewWidget
                key={id}
                stars={stars}
                reviewText={text}
                avatar={getMediaContent(profile.image)}
                name={getFullName(profile.firstName, profile.lastName)}
                url={getVolunteerPersonalPageUrl(locale, profile.id)}
            />
        );
    }), [reviewsData, visibleCount, volunteerData, getFullName, locale]);

    if (reviewsData.length === 0) return null;

    return (
        <div id="6" className={cn(className, styles.wrapper)}>
            <Text title={t("personalHost.Отзывы")} titleSize="h3" />
            <div className={styles.container}>{renderCards}</div>
            {visibleCount < reviewsData.length && <ShowNext onClick={handleShowNext} />}
        </div>
    );
});
