import cn from "classnames";
import React, { FC, memo } from "react";
import { Droppable } from "react-beautiful-dnd";

import { useTranslation } from "react-i18next";
import { Offer, OfferState } from "@/entities/Offer";

import { NotesCard } from "../NotesCard/NotesCard";
import styles from "./NotesContainer.module.scss";

interface NotesContainerProps {
    offers: Offer[];
    className?: string;
    color: string;
    status: OfferState;
    isDragDisable: boolean;
}

export const NotesContainer: FC<NotesContainerProps> = memo(
    (props: NotesContainerProps) => {
        const {
            offers,
            className,
            color = "#000",
            status,
            isDragDisable,
        } = props;
        const { t } = useTranslation();

        return (
            <div className={cn(className, styles.wrapper)}>
                <div
                    className={styles.top}
                    style={{ borderBottom: `2px solid ${color}` }}
                >
                    <span className={styles.title}>{t(`notes.${status}`)}</span>
                    <span className={styles.number}>
                        {offers?.length || 0}
                    </span>
                </div>
                <div className={styles.container}>
                    <Droppable isDropDisabled={isDragDisable} droppableId={status}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={styles.droppable}
                            >
                                {offers.map((offer, index) => (
                                    <NotesCard
                                        className={styles.noteCard}
                                        key={offer.id}
                                        offer={offer}
                                        index={index}
                                        isDragDisable={isDragDisable}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        );
    },
);
