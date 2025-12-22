import cn from "classnames";
import { memo } from "react";

import { useTranslation } from "react-i18next";
import birthdayIcon from "@/shared/assets/icons/offers/cake.svg";
import menIcon from "@/shared/assets/icons/offers/men.svg";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
import { Text } from "@/shared/ui/Text/Text";

import { OfferWhoNeeds } from "../../model/types/offerWhoNeeds";
import styles from "./OfferWhoNeedsCard.module.scss";
import { useFormatGenders } from "@/shared/hooks/useFormatGenders";

interface OfferWhoNeedsCardProps {
    className?: string;
    whoNeeds: OfferWhoNeeds;
}

export const OfferWhoNeedsCard = memo((props: OfferWhoNeedsCardProps) => {
    const { className, whoNeeds } = props;
    const { t } = useTranslation("offer");
    const formattedGenders = useFormatGenders(whoNeeds.genders);

    return (
        <div className={cn(className, styles.wrapper)}>
            <Text title={t("personalOffer.Кто нужен")} titleSize="h3" />
            <div className={styles.cards}>
                <IconTextComponent
                    text={formattedGenders}
                    icon={menIcon}
                    alt="genders"
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
