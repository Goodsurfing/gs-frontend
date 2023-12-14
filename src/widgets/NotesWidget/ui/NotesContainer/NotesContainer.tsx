import cn from "classnames";
import React, { FC, memo, useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";

import { Offer, OfferStatus } from "@/entities/Offer";

import { NotesCard } from "../NotesCard/NotesCard";
import styles from "./NotesContainer.module.scss";

interface NotesContainerProps {
    offers: Offer[];
    className?: string;
    color: string;
    status: OfferStatus;
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

        return (
            <Droppable isDropDisabled={isDragDisable} droppableId={status}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cn(className, styles.wrapper)}
                    >
                        <div
                            className={styles.top}
                            style={{ borderBottom: `2px solid ${color}` }}
                        >
                            <span className={styles.title}>{status}</span>
                            <span className={styles.number}>
                                {offers?.length || 0}
                            </span>
                        </div>
                        <div className={styles.container}>
                            {offers.map((offer, index) => (
                                <NotesCard
                                    key={offer.id}
                                    offer={offer}
                                    index={index}
                                    isDragDisable={isDragDisable}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        );
    },
);
