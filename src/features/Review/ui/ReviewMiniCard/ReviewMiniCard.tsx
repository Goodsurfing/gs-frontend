import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { FullFormApplication } from "@/entities/Application";

import { textSlice } from "@/shared/lib/textSlice";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./ReviewMiniCard.module.scss";
import { getOfferPersonalPageUrl, getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullName } from "@/shared/lib/getFullName";

interface ReviewMiniCardProps {
    data: FullFormApplication;
    onReviewClick: (id: FullFormApplication) => void;
    variant: "offer" | "volunteer";
    locale: Locale;
}

export const ReviewMiniCard: FC<ReviewMiniCardProps> = ({
    data,
    onReviewClick,
    variant,
    locale,
}: ReviewMiniCardProps) => {
    const { vacancy, volunteer } = data;
    const { description, where } = vacancy;
    const { t } = useTranslation("volunteer");
    const navigate = useNavigate();

    const navigateToVolunteer = () => {
        navigate(getVolunteerPersonalPageUrl(locale, volunteer.profile.id));
    };

    const navigateToOffer = () => {
        navigate(getOfferPersonalPageUrl(locale, vacancy.id.toString()));
    };

    if (variant === "volunteer") {
        return (
            <div className={styles.wrapper}>
                <div className={styles.userInfoContainer} onClick={navigateToVolunteer}>
                    <Avatar icon={getMediaContent(volunteer.profile.image)} size="SMALL" />
                    <div className={styles.nameAddress}>
                        <span className={styles.name}>
                            {textSlice(
                                `${getFullName(volunteer.profile.firstName, volunteer.profile.lastName)}`,
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
                    onClick={() => onReviewClick(data)}
                >
                    {t("volunteer-review.Добавить отзыв")}
                </Button>
            </div>
        );
    }

    if (variant === "offer") {
        return (
            <div className={styles.wrapper}>
                <div className={styles.userInfoContainer} onClick={navigateToOffer}>
                    <Avatar icon={getMediaContent(description?.image)} size="SMALL" />
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
                    onClick={() => onReviewClick(data)}
                >
                    {t("volunteer-review.Добавить отзыв")}
                </Button>
            </div>
        );
    }

    return null;
};
