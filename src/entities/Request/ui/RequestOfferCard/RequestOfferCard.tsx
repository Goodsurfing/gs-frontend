import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Application } from "@/entities/Host";

import { getMessengerPageUrl } from "@/shared/config/routes/AppUrls";
import { useCategories } from "@/shared/data/categories";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { textSlice } from "@/shared/lib/textSlice";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./RequestOfferCard.module.scss";

interface RequestOfferCardProps {
    application: Application;
    className?: string;
    onReviewClick?: (id: number) => void;
    showStatus?: boolean;
    showButtons?: boolean;
}

export const RequestOfferCard: FC<RequestOfferCardProps> = (props) => {
    const {
        application,
        className,
        onReviewClick,
        showButtons = true,
        showStatus,
    } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const imageCover = getMediaContent(
        getMediaContent(application.vacancy.description?.image),
    );
    const { status, vacancy } = application;
    const { getTranslation } = useCategories();

    const onMessageClick = () => {
        navigate(getMessengerPageUrl(locale));
    };

    return (
        <div className={cn(className, styles.wrapper)}>
            {showStatus && (
                <div className={cn(styles.status, styles[status])}>
                    {t(`notes.${status}`)}
                </div>
            )}
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
                            30,
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
            <div className={styles.buttons}>
                {showButtons && (
                    <>
                        <Button
                            className={styles.button}
                            color="BLUE"
                            size="SMALL"
                            variant="OUTLINE"
                            onClick={onMessageClick}
                        >
                            {t("notes.Сообщение")}
                        </Button>
                        {application.status === "accepted" && (
                            <Button
                                className={styles.button}
                                color="BLUE"
                                size="SMALL"
                                variant="OUTLINE"
                                onClick={() => onReviewClick?.(application.id)}
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
