import cn from "classnames";
import React, { FC, memo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";

import { NotesApplicationCard } from "../NotesApplicationCard/NotesApplicationCard";
import { NotesCard } from "../NotesCard/NotesCard";
import { Application, FormApplicationStatus } from "@/entities/Application";
import { Locale } from "@/entities/Locale";
import styles from "./NotesContainer.module.scss";

export type VariantType = "host" | "volunteer";
interface NotesContainerProps {
    notes: Application[];
    className?: string;
    color: string;
    status: FormApplicationStatus;
    isDragDisable: boolean;
    variant: VariantType;
    onReviewClick: (application: Application) => void;
    onAcceptClick?: (applicationId: number) => void;
    onCancelClick?: (applicationId: number) => void;
    locale: Locale;
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
            onReviewClick,
            onAcceptClick,
            onCancelClick,
            locale,
        } = props;
        const { t } = useTranslation();

        const translateLib: Record<string, string> = {
            new: t("notes.new"),
            accepted: t("notes.accepted"),
            canceled: t("notes.canceled"),
        };

        const renderNotes = () => {
            if (variant === "host") {
                return notes.map((application, index) => (
                    <NotesApplicationCard
                        key={application.id}
                        application={application}
                        className={styles.noteCard}
                        index={index}
                        isDragDisable={false}
                        onReviewClick={onReviewClick}
                        onAcceptClick={onAcceptClick}
                        onCancelClick={onCancelClick}
                        locale={locale}
                    />
                ));
            }
            return notes.map((application, index) => (
                <NotesCard
                    onReviewClick={onReviewClick}
                    key={application.id}
                    application={application}
                    className={styles.noteCard}
                    index={index}
                    isDragDisable
                    locale={locale}
                />
            ));
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <div
                    className={styles.top}
                    style={{ borderBottom: `2px solid ${color}` }}
                >
                    <span className={styles.title}>{translateLib[status]}</span>
                    <span className={styles.number}>{notes?.length || 0}</span>
                </div>
                <div className={styles.container}>
                    <Droppable
                        isDropDisabled={isDragDisable}
                        droppableId={status}
                    >
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
