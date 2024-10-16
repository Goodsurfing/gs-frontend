import cn from "classnames";
import React, { FC, memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FullFormApplication, RequestCard } from "@/entities/Application";

interface NotesApplicationCardProps {
    className?: string;
    application: FullFormApplication;
    index: number;
    isDragDisable: boolean;
    onReviewClick: (application: FullFormApplication) => void;
}

export const NotesApplicationCard: FC<NotesApplicationCardProps> = memo(
    (props: NotesApplicationCardProps) => {
        const {
            application,
            index,
            className,
            isDragDisable,
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
                        <RequestCard application={application} />
                    </div>
                )}
            </Draggable>
        );
    },
);
