import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { SimpleFormApplication } from "@/entities/Application";

import { textSlice } from "@/shared/lib/textSlice";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./ReviewMiniCard.module.scss";
import { getOfferPersonalPageUrl, getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetFullName } from "@/shared/lib/getFullName";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";

interface ReviewMiniCardProps {
    data: SimpleFormApplication;
    onReviewClick: (id: SimpleFormApplication) => void;
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
    let volunteerId: string;
    if (typeof volunteer === "string") {
        volunteerId = volunteer.split("/").pop() || "";
    } else {
        volunteerId = volunteer.profile.id;
    }
    const { data: volunteerData } = useGetVolunteerByIdQuery(volunteerId ?? "");
    const { getFullName } = useGetFullName();
    const navigate = useNavigate();

    if (!volunteerData) {
        return null;
    }

    const navigateToVolunteer = () => {
        navigate(getVolunteerPersonalPageUrl(locale, volunteerData.profile.id));
    };

    const navigateToOffer = () => {
        navigate(getOfferPersonalPageUrl(locale, vacancy.id.toString()));
    };

    if (variant === "volunteer") {
        return (
            <div className={styles.wrapper}>
                <div className={styles.userInfoContainer} onClick={navigateToVolunteer}>
                    <Avatar icon={getMediaContent(volunteerData.profile.image)} size="SMALL" />
                    <div className={styles.nameAddress}>
                        <span className={styles.name}>
                            {textSlice(
                                `${getFullName(volunteerData.profile.firstName, volunteerData.profile.lastName)}`,
                                50,
                                "title",
                            )}
                        </span>
                        <span className={styles.address}>
                            {textSlice(
                                volunteerData.profile.country,
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
