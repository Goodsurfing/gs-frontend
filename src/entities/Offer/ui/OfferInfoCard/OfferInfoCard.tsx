import { memo } from "react";

import cn from "classnames";

import { Offer } from "../../model/types/offer";

import { OfferWhenCard } from "../OfferWhenCard/OfferWhenCard";
import { OfferWhoNeedsCard } from "../OfferWhoNeedsCard/OfferWhoNeedsCard";
import styles from "./OfferInfoCard.module.scss";
import { OfferConditionsCard } from "../OfferConditionsCard/OfferConditionsCard";
import { OfferPaymentCard } from "../OfferPaymentCard/OfferPaymentCard";
import { OfferDescriptionCard } from "../OfferDescriptionCard/OfferDescriptionCard";

interface HostInfoCardProps {
    className?: string;
    offer: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className, offer } = props;
    return (
        <div className={cn(className)}>
            <OfferWhenCard offerWhen={offer.when} />
            <OfferWhoNeedsCard whoNeeds={offer.whoNeeds} className={styles.container} />
            {offer.finishingTouches.extraConditions
            && (
                <OfferConditionsCard
                    finishingTouches={offer.finishingTouches}
                    className={styles.wrapper}
                />
            )}
            {(offer.conditions.payment.contribution || offer.conditions.payment.reward) && (
                <OfferPaymentCard payment={offer.conditions.payment} className={styles.container} />
            )}
            <OfferDescriptionCard description={offer.description} className={styles.container} />
        </div>
    );
});
