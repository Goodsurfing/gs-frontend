import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./ReviewVolunteerMiniCard.module.scss";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { NotDoneReviewVolunteer } from "@/entities/Review";

interface ReviewVolunteerMiniCardProps {
    data: NotDoneReviewVolunteer;
    onReviewClick: (review: NotDoneReviewVolunteer) => void;
    locale: Locale;
}

export const ReviewVolunteerMiniCard: FC<ReviewVolunteerMiniCardProps> = ({
    data,
    onReviewClick,
    locale,
}: ReviewVolunteerMiniCardProps) => {
    const {
        id, name, image, address,
    } = data;

    const { t } = useTranslation("volunteer");
    const navigate = useNavigate();

    const navigateToOffer = useCallback(() => {
        navigate(getOfferPersonalPageUrl(locale, id.toString()));
    }, [id, locale, navigate]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.userInfoContainer} onClick={navigateToOffer}>
                <Avatar icon={getMediaContent(image?.thumbnails?.small)} size="SMALL" />
                <div className={styles.nameAddress}>
                    <span className={styles.name}>
                        {name}
                    </span>
                    <span className={styles.address}>{address}</span>
                </div>
            </div>
            <Button
                color="BLUE"
                variant="FILL"
                size="SMALL"
                className={styles.btn}
                onClick={() => onReviewClick(data)}
            >
                {t("volunteer-review.Добавить отзыв")}
            </Button>
        </div>
    );
};
