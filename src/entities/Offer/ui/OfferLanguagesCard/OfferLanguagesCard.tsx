import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useFormatLanguages } from "@/shared/data/languages";
import styles from "./OfferLanguagesCard.module.scss";
import { Language } from "@/types/languages";
import { Text } from "@/shared/ui/Text/Text";

interface OfferLanguagesCardProps {
    languages: Language[];
    className?: string;
}

export const OfferLanguagesCard: FC<OfferLanguagesCardProps> = memo(
    (props: OfferLanguagesCardProps) => {
        const { languages, className } = props;
        const { t } = useTranslation("offer");
        return (
            <div className={cn(className, styles.wrapper)}>
                <Text title={t("personalOffer.Владение языками")} titleSize="h3" />
                <span className={styles.languages}>{useFormatLanguages(languages)}</span>
            </div>
        );
    },
);
