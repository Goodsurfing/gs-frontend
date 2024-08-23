import cn from "classnames";
import React, { FC, memo } from "react";
import { Draggable } from "react-beautiful-dnd";

import { useTranslation } from "react-i18next";

import { Avatar } from "@/shared/ui/Avatar/Avatar";

import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Application } from "@/entities/Host";
import { textSlice } from "@/shared/lib/textSlice";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getMessengerPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useCategories } from "@/shared/data/categories";
import styles from "./NotesCard.module.scss";

interface NotesCardProps {
    className?: string;
    application: Application;
    index: number;
    isDragDisable: boolean;
    onReviewClick: (id: number) => void;
}

export const NotesCard: FC<NotesCardProps> = memo((props: NotesCardProps) => {
    const {
        application,
        index,
        className,
        isDragDisable,
        onReviewClick,
    } = props;
    const { t } = useTranslation();
    const { locale } = useLocale();
    const imageCover = getMediaContent(getMediaContent(application.vacancy.description?.image));
    const { status, vacancy } = application;
    const { getTranslation } = useCategories();

    return (
        <Draggable
            isDragDisabled={isDragDisable}
            key={application.id}
            draggableId={application.id.toString()}
            index={index}
        >
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(className, styles.wrapper)}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    <div
                        className={cn(styles.status, styles[status])}
                    >
                        {t(`notes.${status}`)}
                    </div>
                    <div className={styles.mainInfo}>
                        <Avatar
                            icon={imageCover}
                            alt="offer title image"
                            className={styles.avatar}
                        />
                        <div className={styles.infoContainer}>
                            <span className={styles.title}>
                                {textSlice(application.vacancy.description?.title, 30, "title")}
                            </span>
                            <span className={styles.address}>
                                {textSlice(application.vacancy.where?.address, 23, "address")}
                            </span>
                            <span className={styles.tag}>
                                {getTranslation(vacancy.description?.categoryIds[0])}
                            </span>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <ButtonLink
                            className={styles.button}
                            type="outlined"
                            path={getMessengerPageUrl(locale)}
                        >
                            {t("notes.Сообщение")}
                        </ButtonLink>
                        {application.status === "accepted" && (
                            <ButtonLink
                                className={styles.button}
                                type="outlined"
                                path={getMessengerPageUrl(locale)}
                                onClick={() => onReviewClick(application.id)}
                            >
                                {t("notes.Написать отзыв")}
                            </ButtonLink>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
});
