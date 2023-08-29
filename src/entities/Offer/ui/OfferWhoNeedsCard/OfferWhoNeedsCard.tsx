import { memo } from "react";
import cn from "classnames";

import { Text } from "@/shared/ui/Text/Text";

import { OfferWhoNeeds } from "../../model/types/offerWhoNeeds";

import styles from "./OfferWhoNeedsCard.module.scss";

interface OfferWhoNeedsCardProps {
    className?: string;
    whoNeeds: OfferWhoNeeds;
}

export const OfferWhoNeedsCard = memo((props: OfferWhoNeedsCardProps) => {
    const { className, whoNeeds } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <Text title="Кто нужен" titleSize="h3" />
            <div className={styles.cards}>
                
                {whoNeeds.gender}
            </div>
        </div>
    );
});
