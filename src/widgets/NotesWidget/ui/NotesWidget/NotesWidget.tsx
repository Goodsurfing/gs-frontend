import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Offer, OfferStatus } from "@/entities/Offer";

import { NotesContainer } from "../NotesContainer/NotesContainer";
import styles from "./NotesWidget.module.scss";

interface NotesWidgetProps {
    offers: Offer[];
    className?: string;
}

export const NotesWidget: FC<NotesWidgetProps> = memo(
    (props: NotesWidgetProps) => {
        const { offers, className } = props;

        const offersByStatus: Record<OfferStatus, Offer[]> = useMemo(
            () => offers.reduce<Record<OfferStatus, Offer[]>>((acc, offer) => {
                acc[offer.status] = [...(acc[offer.status] || []), offer];
                return acc;
            }, {} as Record<OfferStatus, Offer[]>),
            [offers],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <NotesContainer
                    offers={offersByStatus["under consideration"]}
                    color="#79C8FF"
                    title="under consideration"
                />
                <NotesContainer
                    offers={offersByStatus.accepted}
                    color="#77EB98"
                    title="accepted"
                />
                <NotesContainer
                    offers={offersByStatus.confirmed}
                    color="#5EECD2"
                    title="confirmed"
                />
                <NotesContainer
                    offers={offersByStatus.rejected}
                    color="#FCC3C3"
                    title="rejected"
                />
            </div>
        );
    },
);
