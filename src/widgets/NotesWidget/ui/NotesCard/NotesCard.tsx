import cn from "classnames";
import React, { FC, memo } from "react";
import { Draggable } from "react-beautiful-dnd";

import { useTranslation } from "react-i18next";
import { Offer } from "@/entities/Offer";

import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./NotesCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface NotesCardProps {
    className?: string;
    offer: Offer;
    index: number;
    isDragDisable: boolean;
}

export const NotesCard: FC<NotesCardProps> = memo((props: NotesCardProps) => {
    const {
        offer: {
            description,
            where,
            id,
        },
        index,
        className,
        isDragDisable,
    } = props;
    const truncateString = (str: string, length: number) => (str.length > length ? `${str.substring(0, length)}...` : str);
    const { t } = useTranslation();
    const offerCover = getMediaContent(description?.image);

    return (
        <Draggable
            isDragDisabled={isDragDisable}
            key={id}
            draggableId={id.toString()}
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
                            icon={offerCover}
                            alt="offer title image"
                            className={styles.avatar}
                        />
                        <div className={styles.infoContainer}>
                            <span className={styles.title}>
                                {description ? truncateString(description.title, 30) : "Без заголовка"}
                            </span>
                            <span className={styles.address}>
                                {where?.address
                                    ? truncateString(where.address, 23)
                                    : "Адрес не указан"}
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
