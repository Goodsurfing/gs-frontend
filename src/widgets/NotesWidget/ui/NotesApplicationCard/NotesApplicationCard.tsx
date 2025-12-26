import cn from "classnames";
import React, { FC, memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Application, RequestCard } from "@/entities/Application";
import { Locale } from "@/entities/Locale";

interface NotesApplicationCardProps {
    className?: string;
    application: Application;
    index: number;
    isDragDisable: boolean;
    onReviewClick: (application: Application) => void;
    onAcceptClick?: (applicationId: number) => void;
    onCancelClick?: (applicationId: number) => void;
    locale: Locale;
}

export const NotesApplicationCard: FC<NotesApplicationCardProps> = memo(
    (props: NotesApplicationCardProps) => {
        const {
            application,
            index,
            className,
            isDragDisable,
            locale,
            onReviewClick,
            onAcceptClick,
            onCancelClick,
        } = props;

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
                        className={cn(className)}
                        style={{
                            ...provided.draggableProps.style,
                        }}
                    >
                        <RequestCard
                            application={application}
                            locale={locale}
                            onReviewClick={onReviewClick}
                            onAcceptClick={onAcceptClick}
                            onCancelClick={onCancelClick}
                        />
                    </div>
                )}
            </Draggable>
        );
    },
);
