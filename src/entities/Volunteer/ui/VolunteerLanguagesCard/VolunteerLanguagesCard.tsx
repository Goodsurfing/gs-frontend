import React, { FC, memo, useMemo } from "react";
import cn from "classnames";

import styles from "./VolunteerLanguagesCard.module.scss";
import { Language } from "@/types/languages";
import { Text } from "@/shared/ui/Text/Text";

interface VolunteerLanguagesCardProps {
    className?: string;
    languages?: Language[];
}

export const VolunteerLanguagesCard: FC<VolunteerLanguagesCardProps> = memo((
    props: VolunteerLanguagesCardProps,
) => {
    const { className, languages } = props;

    const renderLanguages = useMemo(() => {
        if (!languages || languages.length === 0) {
            return <span>Языки не были указаны</span>;
        }
        return languages.map(({ language, languageLevel }, index) => (
            <span style={{ color: "#0E1D27" }} key={index}>
                {language}
                {" "}
                /
                {" "}
                <span style={{ color: "#8494A1" }}>{languageLevel}</span>
                {index !== languages.length - 1 && ","}
                {" "}
            </span>
        ));
    }, [languages]);

    return (
        <div className={cn(className, styles.wrapper)}>
            <Text title="Языки" titleSize="h3" />
            <div className={styles.container}>
                {renderLanguages}
            </div>

        </div>
    );
});
