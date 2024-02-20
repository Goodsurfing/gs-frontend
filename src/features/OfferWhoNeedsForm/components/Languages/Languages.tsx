import React, { FC } from "react";
import SelectField from "@/components/SelectField/SelectField";
import { IOptionLanguage, IOptionLevelLanguage } from "@/types/select";

import { LevelLanguage } from "@/entities/Offer/model/types/offerWhoNeeds";

import { allLangs, langsLevels } from "./Languages.data";
import styles from "./Languages.module.scss";
import { LanguagesProps } from "./types";

const Languages: FC<LanguagesProps> = (props) => {
    const { close, value, onChange } = props;

    const getObjectFromValue = (
        valueObject: string | LevelLanguage,
        options: IOptionLanguage[] | IOptionLevelLanguage[],
    ) => options.find((option) => option.value === valueObject);

    return (
        <div className={styles.wrapper}>
            <SelectField
                className={styles.all}
                name="allLangs"
                label="Знание языков"
                options={allLangs}
                value={getObjectFromValue(value.language, allLangs)}
                onChange={(newValue: IOptionLanguage) => {
                    onChange({
                        ...value,
                        language: newValue.value,
                    });
                }}
            />
            <SelectField
                className={styles.levels}
                name="langLevels"
                label="Уровень владения"
                options={langsLevels}
                value={getObjectFromValue(value.level, langsLevels)}
                onChange={(newValue: IOptionLevelLanguage) => onChange({
                    ...value,
                    level: newValue.value,
                })}
            />
            {close}
        </div>
    );
};

export default Languages;
