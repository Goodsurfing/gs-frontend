import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
    Application,
    FormApplicationStatus,
} from "@/entities/Application";

import useDebounce from "@/shared/hooks/useDebounce";

import { statusColors } from "../../model/lib/statusColors";
import { NotesContainer, VariantType } from "../NotesContainer/NotesContainer";
import styles from "./NotesWidget.module.scss";
import { Locale } from "@/entities/Locale";

interface NotesWidgetProps {
    notes: Application[];
    className?: string;
    isDragDisable: boolean;
    variant: VariantType;
    onReviewClick: (application: Application) => void;
    updateApplicationStatus?: (
        applicationId: number,
        status: FormApplicationStatus,
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

        const [notes, setNotes] = useState<Application[]>([]);

        useEffect(() => {
            setNotes([...initialNotes]);
        }, [initialNotes]);

        const [columns, setColumns] = useState<
        Record<FormApplicationStatus, Application[]>
        >({
            new: [],
            accepted: [],
            canceled: [],
        });

        useEffect(() => {
            const newColumns: Record<
            FormApplicationStatus,
            Application[]
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

            updateApplicationStatus?.(
                debouncedStatusChange.applicationId,
                debouncedStatusChange.status,
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedStatusChange, initialNotes]);

        const changeApplicationStatus = (
            applicationId: number,
            newStatus: FormApplicationStatus,
        ) => {
            const note = notes.find((n) => n.id === applicationId);
            if (!note) return;
            const updatedNote = { ...note, status: newStatus };

            setNotes((prev) => prev.map((n) => (n.id === applicationId ? updatedNote : n)));

            setColumns((prevColumns) => {
                const newColumns = { ...prevColumns };

                Object.keys(newColumns).forEach((key) => {
                    newColumns[key as FormApplicationStatus] = newColumns[
                        key as FormApplicationStatus
                    ].filter((n) => n.id !== applicationId);
                });

                newColumns[newStatus].push(updatedNote);

                return newColumns;
            });

            setPendingStatusChange({
                applicationId,
                status: newStatus,
            });
        };

        const onDragEnd = (result: DropResult) => {
            const { destination, source } = result;

            if (!destination) return;

            if (
                destination.droppableId === source.droppableId
        && destination.index === source.index
            ) {
                return;
            }

            const sourceStatus = source.droppableId as FormApplicationStatus;
            const destStatus = destination.droppableId as FormApplicationStatus;

            if (sourceStatus === destStatus) {
                const updatedNotes = Array.from(columns[sourceStatus]);
                const [movedNote] = updatedNotes.splice(source.index, 1);
                updatedNotes.splice(destination.index, 0, movedNote);

                setColumns((prev) => ({
                    ...prev,
                    [sourceStatus]: updatedNotes,
                }));

                return;
            }

            const movedNote = columns[sourceStatus][source.index];
            changeApplicationStatus(movedNote.id, destStatus);
        };

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={cn(className, styles.wrapper)}>
                    {Object.entries(columns).map(([status, columnNotes]) => (
                        <NotesContainer
                            onReviewClick={onReviewClick}
                            onAcceptClick={(appId) => { changeApplicationStatus(appId, "accepted"); }}
                            onCancelClick={(appId) => { changeApplicationStatus(appId, "canceled"); }}
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
