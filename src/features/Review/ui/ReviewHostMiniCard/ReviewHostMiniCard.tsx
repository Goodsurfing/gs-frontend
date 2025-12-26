import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import cn from "classnames";
import { textSlice } from "@/shared/lib/textSlice";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetFullName } from "@/shared/lib/getFullName";
import { NotDoneReviewHost } from "@/entities/Review";
import styles from "./ReviewHostMiniCard.module.scss";

interface ReviewHostMiniCardProps {
    data: NotDoneReviewHost;
    onReviewClick: (volunteer: NotDoneReviewHost) => void;
    locale: Locale;
    className?: string;
}

export const ReviewHostMiniCard: FC<ReviewHostMiniCardProps> = (props: ReviewHostMiniCardProps) => {
    const {
        data,
        onReviewClick,
        locale,
        className,
    } = props;
    const {
        id, firstName, lastName, image, country,
    } = data;
    const { t } = useTranslation("volunteer");

    const { getFullName } = useGetFullName();
    const navigate = useNavigate();
    const userName = textSlice(getFullName(firstName, lastName), 50, "title");
    const address = textSlice(country, 25, "address");

    const navigateToVolunteer = () => {
        navigate(getVolunteerPersonalPageUrl(locale, id));
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.userInfoContainer} onClick={navigateToVolunteer}>
                <Avatar icon={getMediaContent(image?.thumbnails?.small)} size="SMALL" />
                <div className={styles.nameAddress}>
                    <span className={styles.name}>
                        {userName}
                    </span>
                    <span className={styles.address}>
                        {address}
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
};
