import cn from "classnames";
import React, { FC, memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Application, RequestOfferCard } from "@/entities/Application";
import { Locale } from "@/entities/Locale";

interface NotesCardProps {
    className?: string;
    application: Application;
    index: number;
    isDragDisable: boolean;
    onReviewClick: (application: Application) => void;
    locale: Locale;
}

export const NotesCard: FC<NotesCardProps> = memo((props: NotesCardProps) => {
    const {
        application, index, className, isDragDisable, onReviewClick, locale,
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
                    <RequestOfferCard
                        locale={locale}
                        application={application}
                        onReviewClick={onReviewClick}
                    />
                </div>
            )}
        </Draggable>
    );
});
