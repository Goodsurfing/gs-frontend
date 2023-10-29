import { memo } from "react";
import cn from "classnames";

import { Text } from "@/shared/ui/Text/Text";

import { OfferWhoNeeds } from "../../model/types/offerWhoNeeds";
import menIcon from "@/shared/assets/icons/offers/men.svg";
import birthdayIcon from "@/shared/assets/icons/offers/cake.svg";

import styles from "./OfferWhoNeedsCard.module.scss";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";

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
                <IconTextComponent text={whoNeeds.gender} icon={menIcon} alt={whoNeeds.gender} />
                {whoNeeds.age && (
                    <IconTextComponent text={whoNeeds.age} icon={birthdayIcon} alt={whoNeeds.age} />
                )}
            </div>
        </div>
    );
});
