import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";

import { DragDropContext } from "react-beautiful-dnd";
import { Offer, OfferStatus } from "@/entities/Offer";
import { NotesContainer } from "../NotesContainer/NotesContainer";
import styles from "./NotesWidget.module.scss";
import { statusColors } from "../../model/lib/statusColors";

interface NotesWidgetProps {
    offers: Offer[];
    className?: string;
}

export const NotesWidget: FC<NotesWidgetProps> = memo(
    (props: NotesWidgetProps) => {
        const { offers: initialOffers, className } = props;

        const [offers] = useState(initialOffers);
        const [columns, setColumns] = useState<Record<OfferStatus, Offer[]>>({
            "under consideration": [],
            accepted: [],
            confirmed: [],
            rejected: [],
        });

        useEffect(() => {
            const newColumns: Record<OfferStatus, Offer[]> = {
                "under consideration": [],
                accepted: [],
                confirmed: [],
                rejected: [],
            };

            offers.forEach((offer) => {
                newColumns[offer.status].push(offer);
            });

            setColumns(newColumns);
        }, [offers]);

        return (
            <DragDropContext onDragEnd={() => {}}>
                <div className={cn(className, styles.wrapper)}>
                    {Object.entries(columns).map(([status, columnOffers]) => (
                        <NotesContainer
                            key={status}
                            status={status as OfferStatus}
                            offers={columnOffers}
                            color={statusColors[status as OfferStatus]}
                            isDragDisable
                        />
                    ))}
                </div>
            </DragDropContext>
        );
    },
);
