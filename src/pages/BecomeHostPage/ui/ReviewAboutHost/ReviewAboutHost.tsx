import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { useGetFeaturedReviewsQuery } from "@/entities/Review";
import { Review, ReviewSlider } from "@/widgets/Review";

import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import Button from "@/shared/ui/Button/Button";

import styles from "./ReviewAboutHost.module.scss";

export const ReviewAboutHost = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { t } = useTranslation("become-host");

    const navigateClick = () => {
        navigate(getProfileRolePageUrl(locale));
    };

    // Настоящие отзывы волонтёров о проектах, отобранные в админке (isFeatured) —
    // те же, что на главной и на странице членства. Раньше здесь была заглушка:
    // один выдуманный отзыв, повторённый трижды.
    const { data: featuredReviews } = useGetFeaturedReviewsQuery();
    const reviews: Review[] = useMemo(
        () => (featuredReviews ?? []).map((review) => ({
            title: review.title,
            text: review.description,
            image: review.images[0] ? getMediaContent(review.images[0], "LARGE") : undefined,
            author: {
                name: review.authorName,
                avatar: getMediaContent(review.authorAvatar ?? undefined, "SMALL") ?? "",
            },
        })),
        [featuredReviews],
    );

    return (
        <div className={styles.wrapper}>
            {reviews.length > 0 && (
                <>
                    <h2>{t("Отзывы о хостах")}</h2>
                    <ReviewSlider
                        about="host"
                        reviews={reviews}
                        slidesPerView={1}
                        slideClass={styles.slideClass}
                    />
                </>
            )}
            <Button
                className={styles.button}
                color="BLUE"
                size="SMALL"
                variant="FILL"
                onClick={navigateClick}
            >
                {t("Начните принимать волонтеров со всей России и мира")}
            </Button>
        </div>
    );
};
