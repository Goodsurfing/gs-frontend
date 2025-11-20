import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import {
    getMessengerPageIdUrl, getOfferPersonalPageUrl, getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import { SimpleFormApplication } from "../../model/types/application";
import CustomLink from "@/shared/ui/Link/Link";
import { Locale } from "@/entities/Locale";
import Button from "@/shared/ui/Button/Button";
import { useGetFullName } from "@/shared/lib/getFullName";
import { useApplicationStatus } from "@/shared/hooks/useApplicationStatus";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";
import styles from "./RequestCard.module.scss";

interface RequestCardProps {
    className?: string;
    application: SimpleFormApplication;
    showStatus?: boolean;
    showButtons?: boolean;
    onReviewClick?: (application: SimpleFormApplication) => void;
    onAcceptClick?: (application: SimpleFormApplication) => void;
    onCancelClick?: (application: SimpleFormApplication) => void;
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
        volunteer, vacancy, status, startDate, endDate,
    } = application;
    let volunteerId: string;
    if (typeof volunteer === "string") {
        volunteerId = volunteer.split("/").pop() || "";
    } else {
        volunteerId = volunteer.profile.id;
    }
    const { data: volunteerData } = useGetVolunteerByIdQuery(volunteerId ?? "");
    const { t } = useTranslation();
    const { getApplicationStatus } = useApplicationStatus();
    const navigate = useNavigate();

    const { getFullName } = useGetFullName();

    if (!volunteerData) {
        return null;
    }

    const address = (!volunteerData.profile.city || !volunteerData.profile.country)
        ? t("notes.Адрес не указан") : `${volunteerData.profile.country}, ${volunteerData.profile.city}`;

    const onMessageClick = () => {
        if (application.chatId) {
            navigate(getMessengerPageIdUrl(locale, application.chatId.toString()));
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
                    to={getVolunteerPersonalPageUrl(locale, volunteerData.profile.id)}
                    variant="DEFAULT"
                >
                    <Avatar
                        icon={getMediaContent(volunteerData.profile.image)}
                        className={styles.image}
                        size="MEDIUM"
                    />
                </CustomLink>
                <CustomLink
                    to={getVolunteerPersonalPageUrl(locale, volunteerData.profile.id)}
                    variant="DEFAULT"
                >
                    <div className={styles.text}>
                        <span
                            className={styles.name}
                        >
                            {getFullName(
                                volunteerData.profile.firstName,
                                volunteerData.profile.lastName,
                            )}
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
                {showButtons && status === "accepted" && (
                    <>
                        {application.chatId && (
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
                        {!application.hasFeedbackFromOrganization && (
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
                    {(application.status === "new" || application.status === "canceled") && (
                        <Button
                            className={styles.button}
                            color="GREEN"
                            variant="FILL"
                            size="SMALL"
                            onClick={() => onAcceptClick?.(application)}
                        >
                            {t("notes.Принять")}
                        </Button>
                    )}
                    {(application.status === "new" || application.status === "accepted") && (
                        <Button
                            className={styles.button}
                            color="RED"
                            variant="FILL"
                            size="SMALL"
                            onClick={() => onCancelClick?.(application)}
                        >
                            {t("notes.Отклонить")}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
});
