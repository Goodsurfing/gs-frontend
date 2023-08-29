import { memo } from "react";

import cn from "classnames";

import { Offer } from "../../model/types/offer";

import styles from "./OfferInfoCard.module.scss";
import { OfferWhenCard } from "../OfferWhenCard/OfferWhenCard";

interface HostInfoCardProps {
    className?: string;
    offer: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className, offer } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <OfferWhenCard offerWhen={offer.when} />
        </div>
    );
});
