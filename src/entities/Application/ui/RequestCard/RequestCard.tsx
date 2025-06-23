import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import {
    getMessengerPageUrl, getOfferPersonalPageUrl, getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import { FullFormApplication } from "../../model/types/application";
import CustomLink from "@/shared/ui/Link/Link";
import { Locale } from "@/entities/Locale";
import Button from "@/shared/ui/Button/Button";
import { useGetFullName } from "@/shared/lib/getFullName";
import { useApplicationStatus } from "@/shared/hooks/useApplicationStatus";
import styles from "./RequestCard.module.scss";

interface RequestCardProps {
    className?: string;
    application: FullFormApplication;
    showStatus?: boolean;
    showButtons?: boolean;
    onReviewClick?: (application: FullFormApplication) => void;
    locale: Locale;
}

export const RequestCard = memo((props: RequestCardProps) => {
    const {
        className,
        application,
        showStatus = true,
        showButtons = true,
        onReviewClick,
        locale,
    } = props;
    const { volunteer, vacancy, status } = application;
    const { t } = useTranslation();
    const { getApplicationStatus } = useApplicationStatus();
    const navigate = useNavigate();

    const { getFullName } = useGetFullName();

    const address = (!volunteer.profile.city || !volunteer.profile.country)
        ? "Адрес не указан" : `${volunteer.profile.country}, ${volunteer.profile.city}`;

    const onMessageClick = () => {
        navigate(getMessengerPageUrl(locale));
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.cardHead}>
                {showStatus && (
                    <div className={cn(styles.notification, styles[status])}>
                        {getApplicationStatus(status)}
                    </div>
                )}
                <CustomLink
                    to={getVolunteerPersonalPageUrl(locale, volunteer.profile.id)}
                    variant="DEFAULT"
                >
                    <Avatar
                        icon={getMediaContent(application.volunteer.profile.image)}
                        className={styles.image}
                        size="MEDIUM"
                    />
                </CustomLink>
                <CustomLink
                    to={getVolunteerPersonalPageUrl(locale, volunteer.profile.id)}
                    variant="DEFAULT"
                >
                    <div className={styles.text}>
                        <span
                            className={styles.name}
                        >
                            {getFullName(volunteer.profile.firstName, volunteer.profile.lastName)}
                        </span>
                        <span className={styles.location}>
                            {address}
                        </span>
                    </div>
                </CustomLink>
            </div>
            <div className={styles.linkWrapper}>
                <Link
                    className={styles.link}
                    to={getOfferPersonalPageUrl(
                        locale,
                        vacancy.id.toString(),
                    )}
                >
                    {vacancy.description?.title}
                </Link>
            </div>
            <div className={styles.buttons}>
                {showButtons && status === "accepted" && (
                    <>
                        <Button
                            className={styles.button}
                            color="BLUE"
                            variant="OUTLINE"
                            size="SMALL"
                            onClick={onMessageClick}
                        >
                            {t("notes.Сообщение")}
                        </Button>
                        <Button
                            className={styles.button}
                            color="BLUE"
                            variant="OUTLINE"
                            size="SMALL"
                            onClick={() => onReviewClick?.(application)}
                        >
                            {t("notes.Написать отзыв")}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
});
