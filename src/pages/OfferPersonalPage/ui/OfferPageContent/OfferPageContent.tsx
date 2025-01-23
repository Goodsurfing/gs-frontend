import cn from "classnames";
import { memo } from "react";

import { Offer, OfferInfoCard } from "@/entities/Offer";

import styles from "./OfferPageContent.module.scss";

interface OfferPageContentProps {
    className?: string;
    offerData: Offer;
}

export const OfferPageContent = memo((props: OfferPageContentProps) => {
    const { className, offerData } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <OfferInfoCard offer={offerData} />
        </div>
    );
});
