import { memo } from "react";

import cn from "classnames";

import { Offer } from "../../model/types/offer";

import { OfferWhenCard } from "../OfferWhenCard/OfferWhenCard";
import { OfferWhoNeedsCard } from "../OfferWhoNeedsCard/OfferWhoNeedsCard";
import styles from "./OfferInfoCard.module.scss";
import { OfferConditionsCard } from "../OfferConditionsCard/OfferConditionsCard";

interface HostInfoCardProps {
    className?: string;
    offer: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className, offer } = props;
    return (
        <div className={cn(className)}>
            <OfferWhenCard offerWhen={offer.when} />
            <OfferWhoNeedsCard className={styles.container} whoNeeds={offer.whoNeeds} />
            {offer.finishingTouches.extraConditions
            && (
                <OfferConditionsCard
                    finishingTouches={offer.finishingTouches}
                    className={styles.wrapper}
                />
            )}
        </div>
    );
});
