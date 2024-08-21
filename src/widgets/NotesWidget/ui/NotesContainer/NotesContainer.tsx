import cn from "classnames";
import React, { FC, memo } from "react";
import { Droppable } from "react-beautiful-dnd";

import { useTranslation } from "react-i18next";
import { OfferState } from "@/entities/Offer";
import styles from "./NotesContainer.module.scss";
import { Application } from "@/entities/Host";
import { NotesCard } from "../NotesCard/NotesCard";
import { NotesApplicationCard } from "../NotesApplicationCard/NotesApplicationCard";

export type VariantType = "host" | "volunteer";
interface NotesContainerProps {
    notes: Application[];
    className?: string;
    color: string;
    status: OfferState;
    isDragDisable: boolean;
    variant: VariantType;
}

export const NotesContainer: FC<NotesContainerProps> = memo(
    (props: NotesContainerProps) => {
        const {
            notes,
            className,
            color = "#000",
            status,
            isDragDisable,
            variant,
        } = props;
        const { t } = useTranslation();

        const renderNotes = () => {
            if (variant === "host") {
                return notes.map((application, index) => (
                    <NotesApplicationCard
                        key={application.id}
                        application={application}
                        className={styles.noteCard}
                        index={index}
                        isDragDisable={false}
                    />
                ));
            }
            return notes.map((application, index) => (
                <NotesCard
                    key={application.id}
                    application={application}
                    className={styles.noteCard}
                    index={index}
                    isDragDisable
                />
            ));
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <div
                    className={styles.top}
                    style={{ borderBottom: `2px solid ${color}` }}
                >
                    <span className={styles.title}>{t(`notes.${status}`)}</span>
                    <span className={styles.number}>
                        {notes?.length || 0}
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
                                {renderNotes()}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        );
    },
);
