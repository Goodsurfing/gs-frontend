import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Languages } from "../../model/types/offerWhoNeeds";
import styles from "./OfferLanguagesCard.module.scss";

interface OfferLanguagesCardProps {
    languages: Languages;
    className?: string;
}

export const OfferLanguagesCard: FC<OfferLanguagesCardProps> = memo(
    (props: OfferLanguagesCardProps) => {
        const { languages, className } = props;

        const renderLanguages = useMemo(() => languages.map((language, index) => (
            <span className={styles.languages} key={index}>{language.language}</span>
        )), [languages]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3 className={styles.title}>Владение языками</h3>
                <span className={styles.languages}>{renderLanguages}</span>
            </div>
        );
    },
);
