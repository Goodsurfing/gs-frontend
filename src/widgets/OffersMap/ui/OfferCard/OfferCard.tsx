import cn from "classnames";
import React, { FC } from "react";
import { ReactSVG } from "react-svg";
import heartIcon from "@/shared/assets/icons/heart-icon.svg";

import { Offer, OfferCard as OfferCardComponent } from "@/entities/Offer";
import styles from "./OfferCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface OfferCardProps {
    data: Offer;
    status: "opened" | "closed";
    className?: string;
    classNameCard?: string
}

export const OfferCard: FC<OfferCardProps> = (props) => {
    const {
        data: {
            description,
            where,
        },
        status,
        className,
        classNameCard,
    } = props;
    const imageCover = getMediaContent(description?.image);
    return (
        <div
            className={cn(styles.wrapper, className, {
                [styles.closed]: status === "closed",
            })}
        >
            <OfferCardComponent
                title={description?.title}
                description={description?.shortDescription}
                category={description?.categoryIds[0]}
                image={imageCover}
                location={where?.address || ""}
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
