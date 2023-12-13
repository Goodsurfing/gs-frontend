import cn from "classnames";
import React, { FC, memo, useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";

import { Offer } from "@/entities/Offer";

import { NotesCard } from "../NotesCard/NotesCard";
import styles from "./NotesContainer.module.scss";

interface NotesContainerProps {
    offers?: Offer[];
    className?: string;
    color: string;
    title: string;
}

export const NotesContainer: FC<NotesContainerProps> = memo(
    (props: NotesContainerProps) => {
        const {
            offers, className, color, title,
        } = props;

        const renderOffers = useMemo(
            () => offers?.map((offer, index) => (
                <NotesCard offer={offer} key={offer.id} index={index} />
            )),
            [offers],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <div
                    className={styles.top}
                    style={{ borderBottom: `2px solid ${color}` }}
                >
                    <span className={styles.title}>{title}</span>
                    <span className={styles.number}>{offers?.length || 0}</span>
                </div>
                <Droppable droppableId={title}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={styles.container}
                        >
                            {renderOffers}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    },
);
