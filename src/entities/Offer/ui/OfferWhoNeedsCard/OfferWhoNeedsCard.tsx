import cn from "classnames";
import { memo } from "react";

import birthdayIcon from "@/shared/assets/icons/offers/cake.svg";
import menIcon from "@/shared/assets/icons/offers/men.svg";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
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
                <IconTextComponent
                    text={whoNeeds.genders.length > 0 ? whoNeeds.genders.join(", ") : "Не указано"}
                    icon={menIcon}
                    alt={whoNeeds.genders}
                />
                <IconTextComponent
                    text={`${whoNeeds.ageMin} - ${whoNeeds.ageMax}`}
                    icon={birthdayIcon}
                    alt={`${whoNeeds.ageMin} - ${whoNeeds.ageMax}`}
                />
            </div>
        </div>
    );
});
