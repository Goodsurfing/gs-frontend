import cn from "classnames";
import React, { FC, memo } from "react";
import { Draggable } from "react-beautiful-dnd";

import { Application } from "@/entities/Host";
import { RequestOfferCard } from "@/entities/Request";

interface NotesCardProps {
    className?: string;
    application: Application;
    index: number;
    isDragDisable: boolean;
    onReviewClick: (id: number) => void;
}

export const NotesCard: FC<NotesCardProps> = memo((props: NotesCardProps) => {
    const {
        application, index, className, isDragDisable, onReviewClick,
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
                        application={application}
                        onReviewClick={onReviewClick}
                    />
                </div>
            )}
        </Draggable>
    );
});
