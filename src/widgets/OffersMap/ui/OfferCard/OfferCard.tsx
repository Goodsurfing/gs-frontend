import cn from "classnames";
import React, { FC } from "react";

import { Offer, OfferCard as OfferCardComponent } from "@/entities/Offer";

import styles from "./OfferCard.module.scss";

interface OfferCardProps {
    data: Offer;
    status: "opened" | "closed";
    className?: string;
}

export const OfferCard: FC<OfferCardProps> = (props) => {
    const {
        data: {
            description: {
                title, titleImage, category, shortDescription,
            },
            where: { address },
        },
        status,
        className,
    } = props;
    return (
        <div
            className={cn(styles.wrapper, className, {
                [styles.closed]: status === "closed",
            })}
        >
            <OfferCardComponent
                title={title}
                description={shortDescription}
                category={category[0]}
                image={titleImage}
                location={address || ""}
                likes="5"
                rating="10"
                reviews="8"
                went="21"
                link="offer-personal/1"
            />
        </div>
    );
};
