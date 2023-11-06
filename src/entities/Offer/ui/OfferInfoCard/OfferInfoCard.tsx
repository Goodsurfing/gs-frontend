import cn from "classnames";
import { memo } from "react";

import { Offer } from "../../model/types/offer";
import { OfferWhenCard } from "../OfferWhenCard/OfferWhenCard";
import { OfferWhoNeedsCard } from "../OfferWhoNeedsCard/OfferWhoNeedsCard";
import styles from "./OfferInfoCard.module.scss";

interface HostInfoCardProps {
    className?: string;
    offer: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className, offer } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <OfferWhenCard offerWhen={offer.when} />
            <OfferWhoNeedsCard whoNeeds={offer.whoNeeds} />
        </div>
    );
});
