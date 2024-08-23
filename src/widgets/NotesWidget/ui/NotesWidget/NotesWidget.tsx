import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { OfferState } from "@/entities/Offer";

import { statusColors } from "../../model/lib/statusColors";
import { NotesContainer, VariantType } from "../NotesContainer/NotesContainer";
import styles from "./NotesWidget.module.scss";
import { Application } from "@/entities/Host";

interface NotesWidgetProps {
    notes: Application[];
    className?: string;
    isDragDisable: boolean;
    variant: VariantType;
    onReviewClick: (id: number) => void;
}

export const NotesWidget: FC<NotesWidgetProps> = memo(
    (props: NotesWidgetProps) => {
        const {
            notes: initialNotes, className, isDragDisable, variant, onReviewClick,
        } = props;

        const [notes] = useState(initialNotes);
        const [columns, setColumns] = useState<Record<OfferState, Application[]>>({
            new: [],
            accepted: [],
            canceled: [],
        });

        useEffect(() => {
            const newColumns: Record<OfferState, Application[]> = {
                new: [],
                accepted: [],
                canceled: [],
            };

            notes.forEach((note) => {
                newColumns[note.status].push(note);
            });

            setColumns(newColumns);
        }, [notes]);

        const onDragEnd = (result: DropResult) => {
            const { destination, source } = result;

            // If note was not dragged to a valid area, do nothing
            if (!destination) {
                return;
            }

            // If the item was dragged back to its original place, do nothing
            if (
                destination.droppableId === source.droppableId
                && destination.index === source.index
            ) {
                return;
            }

            // Start updating the state
            const startNotes = columns[source.droppableId as OfferState];
            const finishNotes = columns[destination.droppableId as OfferState];

            // If the item was dragged within the same column
            if (startNotes === finishNotes) {
                const newNotes = Array.from(startNotes);
                const [removed] = newNotes.splice(source.index, 1);
                newNotes.splice(destination.index, 0, removed);

                const newColumns = {
                    ...columns,
                    [source.droppableId]: newNotes,
                };

                setColumns(newColumns);
                return;
            }

            // If the item was dragged to another column
            const startNewNotes = Array.from(startNotes);
            const [removed] = startNewNotes.splice(source.index, 1);
            removed.status = destination.droppableId as OfferState;
            const finishNewNotes = Array.from(finishNotes);
            finishNewNotes.splice(destination.index, 0, removed);

            const newColumns = {
                ...columns,
                [source.droppableId]: startNewNotes,
                [destination.droppableId]: finishNewNotes,
            };

            setColumns(newColumns);
        };

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={cn(className, styles.wrapper)}>
                    {Object.entries(columns).map(([status, columnNotes]) => (
                        <NotesContainer
                            onReviewClick={onReviewClick}
                            key={status}
                            status={status as OfferState}
                            notes={columnNotes}
                            color={statusColors[status as OfferState]}
                            variant={variant}
                            isDragDisable={isDragDisable}
                        />
                    ))}
                </div>
            </DragDropContext>
        );
    },
);
