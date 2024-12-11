import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import {
    FormApplicationStatus,
    FullFormApplication,
} from "@/entities/Application";

import useDebounce from "@/shared/hooks/useDebounce";

import { statusColors } from "../../model/lib/statusColors";
import { NotesContainer, VariantType } from "../NotesContainer/NotesContainer";
import styles from "./NotesWidget.module.scss";
import { Locale } from "@/entities/Locale";

interface NotesWidgetProps {
    notes: FullFormApplication[];
    className?: string;
    isDragDisable: boolean;
    variant: VariantType;
    onReviewClick: (application: FullFormApplication) => void;
    updateApplicationStatus?: (
        applicationId: number,
        status: FormApplicationStatus
    ) => void;
    locale: Locale;
}

export const NotesWidget: FC<NotesWidgetProps> = memo(
    (props: NotesWidgetProps) => {
        const {
            notes: initialNotes,
            className,
            isDragDisable,
            variant,
            onReviewClick,
            updateApplicationStatus,
            locale,
        } = props;

        const [notes] = useState(initialNotes);
        const [columns, setColumns] = useState<
        Record<FormApplicationStatus, FullFormApplication[]>
        >({
            new: [],
            accepted: [],
            canceled: [],
        });

        useEffect(() => {
            const newColumns: Record<
            FormApplicationStatus,
            FullFormApplication[]
            > = {
                new: [],
                accepted: [],
                canceled: [],
            };

            notes.forEach((note) => {
                newColumns[note.status].push(note);
            });

            setColumns(newColumns);
        }, [notes]);

        const [pendingStatusChange, setPendingStatusChange] = useState<{
            applicationId: number;
            status: FormApplicationStatus;
        } | null>(null);

        const debouncedStatusChange = useDebounce(pendingStatusChange, 500);

        useEffect(() => {
            if (!debouncedStatusChange) return;

            const changedNote = initialNotes.find(
                (note) => note.id === debouncedStatusChange.applicationId
                    && note.status === debouncedStatusChange.status,
            );

            if (!changedNote) {
                updateApplicationStatus?.(
                    debouncedStatusChange.applicationId,
                    debouncedStatusChange.status,
                );
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedStatusChange, initialNotes]);

        const onDragEnd = (result: DropResult) => {
            const { destination, source } = result;

            if (!destination) return;

            if (
                destination.droppableId === source.droppableId
                && destination.index === source.index
            ) {
                return;
            }

            const sourceColumn = columns[source.droppableId as FormApplicationStatus];
            const destinationColumn = columns[destination.droppableId as FormApplicationStatus];

            const updatedSourceNotes = Array.from(sourceColumn);
            const updatedDestinationNotes = sourceColumn === destinationColumn
                ? updatedSourceNotes
                : Array.from(destinationColumn);

            const [movedNote] = updatedSourceNotes.splice(source.index, 1);

            const updatedNote = {
                ...movedNote,
                status: destination.droppableId as FormApplicationStatus,
            };

            updatedDestinationNotes.splice(destination.index, 0, updatedNote);

            setColumns((prevColumns) => ({
                ...prevColumns,
                [source.droppableId]: updatedSourceNotes,
                [destination.droppableId]: updatedDestinationNotes,
            }));

            setPendingStatusChange({
                applicationId: updatedNote.id,
                status: updatedNote.status,
            });
        };

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={cn(className, styles.wrapper)}>
                    {Object.entries(columns).map(([status, columnNotes]) => (
                        <NotesContainer
                            onReviewClick={onReviewClick}
                            key={status}
                            status={status as FormApplicationStatus}
                            notes={columnNotes}
                            color={
                                statusColors[status as FormApplicationStatus]
                            }
                            variant={variant}
                            isDragDisable={isDragDisable}
                            locale={locale}
                        />
                    ))}
                </div>
            </DragDropContext>
        );
    },
);
