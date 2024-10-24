import { FC } from "react";
import { useTranslation } from "react-i18next";

import { FullFormApplication } from "@/entities/Application";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";
import { textSlice } from "@/shared/lib/textSlice";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./ReviewMiniCard.module.scss";

interface ReviewMiniCardProps {
    data: FullFormApplication;
    onReviewClick: (id: number) => void;
    variant: "offer" | "volunteer";
}

export const ReviewMiniCard: FC<ReviewMiniCardProps> = ({
    data,
    onReviewClick,
    variant,
}: ReviewMiniCardProps) => {
    const { id, vacancy, volunteer } = data;
    const { description, where } = vacancy;
    const { t } = useTranslation("volunteer");

    if (variant === "volunteer") {
        return (
            <div className={styles.wrapper}>
                <div className={styles.userInfoContainer}>
                    <Avatar icon={defaultAvatarImage} size="SMALL" />
                    <div className={styles.nameAddress}>
                        <span className={styles.name}>
                            {textSlice(
                                `${volunteer.profile.firstName} ${volunteer.profile.lastName}`,
                                50,
                                "title",
                            )}
                        </span>
                        <span className={styles.address}>
                            {textSlice(
                                volunteer.profile.country,
                                25,
                                "address",
                            )}
                        </span>
                    </div>
                </div>
                <Button
                    color="BLUE"
                    variant="FILL"
                    size="SMALL"
                    className={styles.btn}
                    onClick={() => onReviewClick(id)}
                >
                    {t("volunteer-review.Добавить отзыв")}
                </Button>
            </div>
        );
    }

    if (variant === "offer") {
        return (
            <div className={styles.wrapper}>
                <div className={styles.userInfoContainer}>
                    <Avatar icon={defaultAvatarImage} size="SMALL" />
                    <div className={styles.nameAddress}>
                        <span className={styles.name}>
                            {description?.title}
                        </span>
                        <span className={styles.address}>{where?.address}</span>
                    </div>
                </div>
                <Button
                    color="BLUE"
                    variant="FILL"
                    size="SMALL"
                    className={styles.btn}
                    onClick={() => onReviewClick(id)}
                >
                    {t("volunteer-review.Добавить отзыв")}
                </Button>
            </div>
        );
    }

    return null;
};
