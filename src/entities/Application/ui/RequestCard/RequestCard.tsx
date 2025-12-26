import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import {
    getMessengerPageIdUrl, getOfferPersonalPageUrl, getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import { Application } from "../../model/types/application";
import CustomLink from "@/shared/ui/Link/Link";
import { Locale } from "@/entities/Locale";
import Button from "@/shared/ui/Button/Button";
import { getFullAddress, useGetFullName } from "@/shared/lib/getFullName";
import { useApplicationStatus } from "@/shared/hooks/useApplicationStatus";
import styles from "./RequestCard.module.scss";

interface RequestCardProps {
    className?: string;
    application: Application;
    showStatus?: boolean;
    showButtons?: boolean;
    onReviewClick?: (application: Application) => void;
    onAcceptClick?: (applicationId: number) => void;
    onCancelClick?: (applicationId: number) => void;
    locale: Locale;
}

export const RequestCard = memo((props: RequestCardProps) => {
    const {
        className,
        application,
        showStatus = true,
        showButtons = true,
        onReviewClick,
        onAcceptClick,
        onCancelClick,
        locale,
    } = props;
    const {
        volunteer, vacancy, status, startDate, endDate, chatId,
        id, isHasReview,
    } = application;

    const { t } = useTranslation();
    const { getApplicationStatus } = useApplicationStatus();
    const navigate = useNavigate();

    const { getFullName } = useGetFullName();
    const userName = getFullName(volunteer.firstName, volunteer.lastName);
    const address = (getFullAddress(volunteer.city, volunteer.country) !== "")
        ? getFullAddress(volunteer.city, volunteer.country) : t("notes.Адрес не указан");

    const onMessageClick = () => {
        if (chatId) {
            navigate(getMessengerPageIdUrl(locale, chatId.toString()));
        }
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
                    to={getVolunteerPersonalPageUrl(locale, volunteer.id)}
                    variant="DEFAULT"
                >
                    <Avatar
                        icon={getMediaContent(volunteer.image?.thumbnails?.small)}
                        className={styles.image}
                        size="MEDIUM"
                    />
                </CustomLink>
                <CustomLink
                    to={getVolunteerPersonalPageUrl(locale, volunteer.id)}
                    variant="DEFAULT"
                >
                    <div className={styles.text}>
                        <span
                            className={styles.name}
                        >
                            {userName}
                        </span>
                        <span className={styles.location}>
                            {address}
                        </span>
                        <span className={styles.date}>
                            {startDate ?? ""}
                            {" "}
                            -
                            {" "}
                            {endDate ?? ""}
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
                    {vacancy.title}
                </Link>
            </div>
            <div className={styles.buttons}>
                {(showButtons && status === "accepted") && (
                    <>
                        {!!application.chatId && (
                            <Button
                                className={styles.button}
                                color="BLUE"
                                variant="OUTLINE"
                                size="SMALL"
                                onClick={onMessageClick}
                            >
                                {t("notes.Сообщение")}
                            </Button>
                        )}
                        {!isHasReview && (
                            <Button
                                className={styles.button}
                                color="BLUE"
                                variant="OUTLINE"
                                size="SMALL"
                                onClick={() => onReviewClick?.(application)}
                            >
                                {t("notes.Написать отзыв")}
                            </Button>
                        )}
                    </>
                )}
            </div>
            {showButtons && (
                <div className={styles.buttons}>
                    {(status === "new" || status === "canceled") && (
                        <Button
                            className={styles.button}
                            color="GREEN"
                            variant="FILL"
                            size="SMALL"
                            onClick={() => onAcceptClick?.(id)}
                        >
                            {t("notes.Принять")}
                        </Button>
                    )}
                    {(status === "new" || status === "accepted") && (
                        <Button
                            className={styles.button}
                            color="RED"
                            variant="FILL"
                            size="SMALL"
                            onClick={() => onCancelClick?.(id)}
                        >
                            {t("notes.Отклонить")}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
});
