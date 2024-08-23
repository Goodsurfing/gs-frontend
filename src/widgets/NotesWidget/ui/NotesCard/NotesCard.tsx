import cn from "classnames";
import React, { FC, memo } from "react";
import { Draggable } from "react-beautiful-dnd";

import { useTranslation } from "react-i18next";

import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./NotesCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Application } from "@/entities/Host";
import { textSlice } from "@/shared/lib/textSlice";

interface NotesCardProps {
    className?: string;
    application: Application;
    index: number;
    isDragDisable: boolean;
}

export const NotesCard: FC<NotesCardProps> = memo((props: NotesCardProps) => {
    const {
        application,
        index,
        className,
        isDragDisable,
    } = props;
    const { t } = useTranslation();
    const imageCover = getMediaContent(getMediaContent(application.vacancy.description?.image));

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
                        className={styles.status}
                        style={{ backgroundColor: "#79C8FF" }}
                    >
                        новая
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
                                Заповедники и нац. парки
                            </span>
                        </div>
                    </div>
                    <Button
                        className={styles.button}
                        color="BLUE"
                        variant="OUTLINE"
                        size="SMALL"
                    >
                        {t("notes.Сообщение")}
                    </Button>
                </div>
            )}
        </Draggable>
    );
});
