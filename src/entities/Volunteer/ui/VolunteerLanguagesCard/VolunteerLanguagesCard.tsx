import React, {
    FC, memo,
} from "react";
import cn from "classnames";

import styles from "./VolunteerLanguagesCard.module.scss";
import { Language } from "@/types/languages";
import { Text } from "@/shared/ui/Text/Text";
import { useFormatLanguages } from "@/shared/data/languages";

interface VolunteerLanguagesCardProps {
    className?: string;
    languages: Language[];
}

export const VolunteerLanguagesCard: FC<VolunteerLanguagesCardProps> = memo((
    props: VolunteerLanguagesCardProps,
) => {
    const { className, languages } = props;
    const textLanguages = useFormatLanguages(languages);

    return (
        <div className={cn(className, styles.wrapper)}>
            <Text title="Языки" titleSize="h3" />
            <div className={styles.container}>
                {languages.length !== 0 ? <div className={styles.languages}>{textLanguages}</div> : "Языки не были указаны"}
            </div>

        </div>
    );
});
