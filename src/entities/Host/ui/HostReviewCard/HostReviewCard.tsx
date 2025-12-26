import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect,
    useState,
} from "react";

import { useTranslation } from "react-i18next";
import { ReviewWidget } from "@/widgets/ReviewWidget";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetFullName } from "@/shared/lib/getFullName";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Text } from "@/shared/ui/Text/Text";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import { GetOfferReviewByHost } from "@/entities/Review";
import { useLazyGetHostReviewByHostIdQuery } from "@/entities/Review/api/reviewApi";
import styles from "./HostReviewCard.module.scss";

interface HostReviewCardProps {
    hostId: string;
    className?: string;
}

const VISIBLE_COUNT = 5;

export const HostReviewCard: FC<HostReviewCardProps> = memo((props: HostReviewCardProps) => {
    const { hostId, className } = props;
    const { t } = useTranslation("host");
    const { locale } = useLocale();
    const { getFullName } = useGetFullName();
    const [page, setPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<GetOfferReviewByHost[]>([]);

    const [getReviewsData, { data: reviewsData }] = useLazyGetHostReviewByHostIdQuery();

    const fetchReviews = useCallback(async (pageItem: number) => {
        try {
            const result = await getReviewsData({
                hostId,
                limit: VISIBLE_COUNT,
                page: pageItem,
            }).unwrap();
            if (result) {
                setReviews((prev) => {
                    if (pageItem === 1) {
                        return [...result.data];
                    }
                    return [...prev, ...result.data];
                });
                setError(null);
            }
        } catch {
            setError("Произошла ошибка загрузки отзывов");
        }
    }, [getReviewsData, hostId]);

    useEffect(() => {
        fetchReviews(page);
    }, [fetchReviews, page]);

    const renderReviews = reviews.map((review) => (
        <ReviewWidget
            name={getFullName(review.firstName, review.lastName)}
            avatar={getMediaContent(review.image?.thumbnails?.small)}
            reviewText={review.description}
            stars={review.rating}
            url={getVolunteerPersonalPageUrl(locale, review.id)}
        />
    ));

    const renderContent = () => {
        if (error) {
            return <div className={styles.error}>{error}</div>;
        }
        if (reviews.length === 0) {
            return t("personal.На данный момент отзывов нет");
        }
        return renderReviews;
    };

    const handleShowNext = () => {
        setPage((prev) => prev + 1);
    };

    if (!reviewsData || reviewsData.pagination.total === 0) {
        return null;
    }

    return (
        <div id="6" className={cn(className, styles.wrapper)}>
            <Text title={t("personalHost.Отзывы")} titleSize="h3" />
            <div className={styles.container}>
                {renderContent()}
            </div>
            {(reviews.length > 0) && (reviews.length < reviewsData.pagination.total) && (
                <ShowNext onClick={handleShowNext} />
            )}
        </div>
    );
});
