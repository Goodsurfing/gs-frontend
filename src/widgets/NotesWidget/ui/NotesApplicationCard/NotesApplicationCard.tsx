import cn from "classnames";
import React, { FC, memo } from "react";
import { Draggable } from "react-beautiful-dnd";

import { Application } from "@/entities/Host";
import { RequestCard } from "@/entities/Request";

interface NotesApplicationCardProps {
    className?: string;
    application: Application;
    index: number;
    isDragDisable: boolean;
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
