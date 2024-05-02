import cn from "classnames";
import React, { FC } from "react";
import { ReactSVG } from "react-svg";
import heartIcon from "@/shared/assets/icons/heart-icon.svg";

import { Offer, OfferCard as OfferCardComponent } from "@/entities/Offer";
import styles from "./OfferCard.module.scss";

interface OfferCardProps {
    data: Offer;
    status: "opened" | "closed";
    className?: string;
    classNameCard?: string
}

export const OfferCard: FC<OfferCardProps> = (props) => {
    const {
        data: {
            description: {
                title, imageId, categoryIds, shortDescription,
            },
            where: { address },
        },
        status,
        className,
        classNameCard,
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
                category={categoryIds[0]}
                image={imageId}
                location={address || ""}
                likes="5"
                rating="10"
                reviews="8"
                went="21"
                link="offer-personal/1"
                className={classNameCard}
            />
            <ReactSVG src={heartIcon} className={cn(styles.favorite)} />
        </div>
    );
};
