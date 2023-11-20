import cn from "classnames";
import { memo } from "react";

import { Offer } from "../../model/types/offer";
import { OfferAddressCard } from "../OfferAddressCard/OfferAddressCard";
import { OfferConditionsCard } from "../OfferConditionsCard/OfferConditionsCard";
import { OfferDescriptionCard } from "../OfferDescriptionCard/OfferDescriptionCard";
import { OfferLanguagesCard } from "../OfferLanguagesCard/OfferLanguagesCard";
import { OfferOrganizationCard } from "../OfferOrganizationCard/OfferOrganizationCard";
import { OfferPaymentCard } from "../OfferPaymentCard/OfferPaymentCard";
import { OfferWhenCard } from "../OfferWhenCard/OfferWhenCard";
import { OfferWhoNeedsCard } from "../OfferWhoNeedsCard/OfferWhoNeedsCard";
import styles from "./OfferInfoCard.module.scss";
import { OfferGalleryCard } from "../OfferGalleryCard/OfferGalleryCard";

interface HostInfoCardProps {
    className?: string;
    offer: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className, offer } = props;
    const address = "Казань улица Пушкина, 46";
    const isShowPaymentCard = offer.conditions.payment.contribution
        || offer.conditions.payment.reward;

    return (
        <div className={cn(className)}>
            <OfferWhenCard offerWhen={offer.when} />
            <OfferWhoNeedsCard
                whoNeeds={offer.whoNeeds}
                className={styles.container}
            />
            {offer.finishingTouches.extraConditions && (
                <OfferConditionsCard
                    finishingTouches={offer.finishingTouches}
                    className={styles.wrapper}
                />
            )}
            {isShowPaymentCard && (
                <OfferPaymentCard
                    payment={offer.conditions.payment}
                    className={styles.container}
                />
            )}
            <OfferDescriptionCard
                description={offer.description}
                className={styles.container}
            />
            <OfferLanguagesCard
                languages={offer.whoNeeds.languages}
                className={styles.container}
            />
            <OfferAddressCard address={address} className={styles.container} />
            <OfferOrganizationCard
                organization={offer.description.organization}
                className={styles.container}
            />
            <OfferGalleryCard gallery={offer.description.images} className={styles.container} />
        </div>
    );
});
