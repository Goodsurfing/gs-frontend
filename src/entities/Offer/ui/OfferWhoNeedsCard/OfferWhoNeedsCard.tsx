import cn from "classnames";
import { memo } from "react";

import { useTranslation } from "react-i18next";
import birthdayIcon from "@/shared/assets/icons/offers/cake.svg";
import menIcon from "@/shared/assets/icons/offers/men.svg";
import globeIcon from "@/shared/assets/icons/navbar/globe.svg";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
import { Text } from "@/shared/ui/Text/Text";

import { OfferWhoNeeds } from "../../model/types/offerWhoNeeds";
import styles from "./OfferWhoNeedsCard.module.scss";
import { useFormatGenders } from "@/shared/hooks/useFormatGenders";
import { NO_AGE_LIMIT } from "@/shared/constants/offerAge";

interface OfferWhoNeedsCardProps {
    className?: string;
    whoNeeds: OfferWhoNeeds;
}

export const OfferWhoNeedsCard = memo((props: OfferWhoNeedsCardProps) => {
    const { className, whoNeeds } = props;
    const { t } = useTranslation("offer");
    const formattedGenders = useFormatGenders(whoNeeds.genders);

    const ageText = whoNeeds.ageMax >= NO_AGE_LIMIT
        ? t("whoNeeds.от {{min}}", { min: whoNeeds.ageMin })
        : t("whoNeeds.от {{min}} до {{max}}", { min: whoNeeds.ageMin, max: whoNeeds.ageMax });

    let receptionPlaceText = null;

    if (whoNeeds.receptionPlace === "foreigners") {
        receptionPlaceText = t("whoNeeds.Только иностранцев");
    }

    if (whoNeeds.receptionPlace === "compatriot") {
        receptionPlaceText = t("whoNeeds.Только из моей страны");
    }

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
                    text={ageText}
                    icon={birthdayIcon}
                    alt={ageText}
                />
                {receptionPlaceText && (
                    <IconTextComponent
                        text={receptionPlaceText}
                        icon={globeIcon}
                        alt="receptionPlace"
                    />
                )}
            </div>
        </div>
    );
});
