import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { Offer, OfferState } from "@/entities/Offer";

import { statusColors } from "../../model/lib/statusColors";
import { NotesContainer } from "../NotesContainer/NotesContainer";
import styles from "./NotesWidget.module.scss";

interface NotesWidgetProps {
    offers: Offer[];
    className?: string;
    isDragDisable: boolean;
}

export const NotesWidget: FC<NotesWidgetProps> = memo(
    (props: NotesWidgetProps) => {
        const { offers: initialOffers, className, isDragDisable } = props;

        const [offers] = useState(initialOffers);
        const [columns, setColumns] = useState<Record<OfferState, Offer[]>>({
            new: [],
            accepted: [],
            confirmed: [],
            rejected: [],
        });

        useEffect(() => {
            const newColumns: Record<OfferState, Offer[]> = {
                new: [],
                accepted: [],
                confirmed: [],
                rejected: [],
            };

            offers.forEach((offer) => {
                newColumns[offer.state].push(offer);
            });

            setColumns(newColumns);
        }, [offers]);

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
            const startOffers = columns[source.droppableId as OfferState];
            const finishOffers = columns[destination.droppableId as OfferState];

            // If the item was dragged within the same column
            if (startOffers === finishOffers) {
                const newOffers = Array.from(startOffers);
                const [removed] = newOffers.splice(source.index, 1);
                newOffers.splice(destination.index, 0, removed);

                const newColumns = {
                    ...columns,
                    [source.droppableId]: newOffers,
                };

                setColumns(newColumns);
                return;
            }

            // If the item was dragged to another column
            const startNewOffers = Array.from(startOffers);
            const [removed] = startNewOffers.splice(source.index, 1);
            removed.state = destination.droppableId as OfferState;
            const finishNewOffers = Array.from(finishOffers);
            finishNewOffers.splice(destination.index, 0, removed);

            const newColumns = {
                ...columns,
                [source.droppableId]: startNewOffers,
                [destination.droppableId]: finishNewOffers,
            };

            setColumns(newColumns);
        };

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={cn(className, styles.wrapper)}>
                    {Object.entries(columns).map(([status, columnOffers]) => (
                        <NotesContainer
                            key={status}
                            status={status as OfferState}
                            offers={columnOffers}
                            color={statusColors[status as OfferState]}
                            isDragDisable={isDragDisable}
                        />
                    ))}
                </div>
            </DragDropContext>
        );
    },
);
