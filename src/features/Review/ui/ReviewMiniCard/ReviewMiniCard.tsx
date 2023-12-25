import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Review } from "@/types/review";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";
import Button from "@/shared/ui/Button/Button";

import styles from "./ReviewMiniCard.module.scss";

interface ReviewMiniCardProps {
    data: Review;
}

export const ReviewMiniCard: FC<ReviewMiniCardProps> = ({
    data,
}: ReviewMiniCardProps) => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        title, image, rating, textReview,
        country,
        city,
    } = data;
    const { t } = useTranslation("volunteer");

    return (
        <div className={styles.wrapper}>
            <div className={styles.userInfoContainer}>
                <img
                    className={styles.avatar}
                    src={defaultAvatarImage}
                    alt="AVATAR"
                />
                <div className={styles.nameAddress}>
                    <span className={styles.name}>
                        {title}
                    </span>
                    <span className={styles.address}>
                        {country}
                        ,
                        {" "}
                        {city}
                    </span>
                </div>
            </div>
            <Button
                color="BLUE"
                variant="FILL"
                size="SMALL"
                className={styles.btn}
            >
                {t("volunteer-review.Добавить отзыв")}
            </Button>
        </div>
    );
};
