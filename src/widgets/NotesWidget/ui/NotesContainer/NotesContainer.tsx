import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Offer } from "@/entities/Offer";

import styles from "./NotesContainer.module.scss";
import { NotesCard } from "../NotesCard/NotesCard";

interface NotesContainerProps {
    offers: Offer[];
    className?: string;
    color: string;
    title: string;
}

export const NotesContainer: FC<NotesContainerProps> = memo(
    (props: NotesContainerProps) => {
        const {
            offers, className, color, title,
        } = props;

        const renderOffers = useMemo(
            () => offers.map((offer, index) => (
                <NotesCard offer={offer} key={index} />
            )),
            [offers],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.top} style={{ borderBottom: `2px solid ${color}` }}>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.number}>{offers.length}</span>
                </div>
                <div className={styles.container}>{renderOffers}</div>
            </div>
        );
    },
);
