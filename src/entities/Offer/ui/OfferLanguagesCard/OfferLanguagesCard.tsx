import cn from "classnames";
import React, { FC, memo } from "react";

import { Languages } from "../../model/types/offerWhoNeeds";
import styles from "./OfferLanguagesCard.module.scss";
import { useFormatLanguages } from "@/shared/data/languages";

interface OfferLanguagesCardProps {
    languages: Languages;
    className?: string;
}

export const OfferLanguagesCard: FC<OfferLanguagesCardProps> = memo(
    (props: OfferLanguagesCardProps) => {
        const { languages, className } = props;

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3 className={styles.title}>Владение языками</h3>
                <span className={styles.languages}>{useFormatLanguages(languages)}</span>
            </div>
        );
    },
);
