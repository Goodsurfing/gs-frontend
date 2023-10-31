import { memo } from "react";

import cn from "classnames";

import { Offer } from "../../model/types/offer";

import { OfferWhenCard } from "../OfferWhenCard/OfferWhenCard";
import { OfferWhoNeedsCard } from "../OfferWhoNeedsCard/OfferWhoNeedsCard";
import { OfferLanguagesCard } from "../OfferLanguagesCard/OfferLanguagesCard";
import styles from "./OfferInfoCard.module.scss";
import { OfferAddressCard } from "../OfferAddressCard/OfferAddressCard";

interface HostInfoCardProps {
    className?: string;
    offer?: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className, offer } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            {/* <OfferWhenCard offerWhen={offer.when} />
            <OfferWhoNeedsCard whoNeeds={offer.whoNeeds} />
            <OfferLanguagesCard languages={offer.whoNeeds.languages} /> */}
            <OfferAddressCard address="улица Пушкина, 46" />
        </div>
    );
});
