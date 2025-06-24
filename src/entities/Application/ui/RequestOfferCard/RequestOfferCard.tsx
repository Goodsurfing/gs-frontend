import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getMessengerPageIdUrl, getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useCategories } from "@/shared/data/categories";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { textSlice } from "@/shared/lib/textSlice";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./RequestOfferCard.module.scss";
import { FullFormApplication } from "../../model/types/application";
import { Locale } from "@/entities/Locale";
import CustomLink from "@/shared/ui/Link/Link";
import { useApplicationStatus } from "@/shared/hooks/useApplicationStatus";

interface RequestOfferCardProps {
    application: FullFormApplication;
    className?: string;
    onReviewClick?: (application: FullFormApplication) => void;
    showStatus?: boolean;
    showButtons?: boolean;
    locale: Locale;
}

export const RequestOfferCard: FC<RequestOfferCardProps> = (props) => {
    const {
        application,
        className,
        onReviewClick,
        showButtons = true,
        showStatus,
        locale,
    } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const imageCover = getMediaContent(application.vacancy.description?.image);
    const { status, vacancy } = application;
    const { getTranslation } = useCategories();
    const { getApplicationStatus } = useApplicationStatus();

    const onMessageClick = () => {
        if (application.chatId) {
            navigate(getMessengerPageIdUrl(locale, application.chatId.toString()));
        }
    };

    return (
        <div className={cn(className, styles.wrapper)}>
            {showStatus && (
                <div className={cn(styles.status, styles[status])}>
                    {getApplicationStatus(status)}
                </div>
            )}
            <CustomLink to={getOfferPersonalPageUrl(locale, vacancy.id.toString())} variant="DEFAULT">
                <div className={styles.mainInfo}>
                    <Avatar
                        icon={imageCover}
                        alt="offer title image"
                        className={styles.avatar}
                    />
                    <div className={styles.infoContainer}>
                        <span className={styles.title}>
                            {textSlice(
                                application.vacancy.description?.title,
                                45,
                                "title",
                            )}
                        </span>
                        <span className={styles.address}>
                            {textSlice(
                                application.vacancy.where?.address,
                                23,
                                "address",
                            )}
                        </span>
                        <span className={styles.tag}>
                            {getTranslation(vacancy.description?.categoryIds[0])}
                        </span>
                    </div>
                </div>
            </CustomLink>
            <div className={styles.buttons}>
                {showButtons && (
                    <>
                        {application.chatId && (
                            <Button
                                className={styles.button}
                                color="BLUE"
                                size="SMALL"
                                variant="OUTLINE"
                                onClick={onMessageClick}
                            >
                                {t("notes.Сообщение")}
                            </Button>
                        )}
                        {(application.status === "accepted" && !application.hasFeedbackFromVolunteer) && (
                            <Button
                                className={styles.button}
                                color="BLUE"
                                size="SMALL"
                                variant="OUTLINE"
                                onClick={() => onReviewClick?.(application)}
                            >
                                {t("notes.Написать отзыв")}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
