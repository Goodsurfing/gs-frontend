import cn from "classnames";
import { memo } from "react";

import { Offer } from "../../model/types/offer";
import { OfferAddressCard } from "../OfferAddressCard/OfferAddressCard";
import { OfferLanguagesCard } from "../OfferLanguagesCard/OfferLanguagesCard";
import { OfferWhenCard } from "../OfferWhenCard/OfferWhenCard";
import { OfferWhoNeedsCard } from "../OfferWhoNeedsCard/OfferWhoNeedsCard";
import styles from "./OfferInfoCard.module.scss";

interface HostInfoCardProps {
    className?: string;
    offer?: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className, offer } = props;
    const address = "Казань улица Пушкина, 46";

    return (
        <div className={cn(className, styles.wrapper)}>
            <OfferWhenCard offerWhen={offer.when} />
            <OfferWhoNeedsCard whoNeeds={offer.whoNeeds} />
            <OfferLanguagesCard languages={offer.whoNeeds.languages} />
            <OfferAddressCard address={address} />
        </div>
    );
});
