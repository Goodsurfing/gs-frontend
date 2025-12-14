import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import SelectField from "@/components/SelectField/SelectField";
import { IOptionLanguage, IOptionLevelLanguage } from "@/types/select";

import { useAllLangs, useLangsLevels } from "@/shared/data/languages";
import { LanguagesProps } from "./types";
import styles from "./Languages.module.scss";
import { LevelLanguage } from "@/types/languages";

const Languages: FC<LanguagesProps> = (props) => {
    const {
        close, value, onChange, selectedLanguages,
    } = props;
    const { t } = useTranslation("offer");
    const allLangs = useAllLangs();
    const allLevels = useLangsLevels();

    const getObjectFromValue = (
        valueObject: string | LevelLanguage,
        options: IOptionLanguage[] | IOptionLevelLanguage[],
    ) => options.find((option) => option.value === valueObject);

    let filteredOptions = allLangs.filter(
        (lang) => !selectedLanguages.some((selected) => selected.language === lang.value),
    );

    if (selectedLanguages.length !== 1) {
        filteredOptions = filteredOptions.filter((lang) => lang.value !== "not_matter");
    }

    return (
        <div className={styles.wrapper}>
            <SelectField
                className={styles.all}
                name="allLangs"
                label={t("whoNeeds.Знание языков")}
                options={filteredOptions}
                value={getObjectFromValue(value.language, allLangs)}
                onChange={(newValue: unknown) => {
                    if (typeof newValue === "object" && newValue !== null && "value" in newValue) {
                        if ((newValue as IOptionLanguage).value === "not_matter") {
                            onChange({ ...value, level: "not_matter", language: "not_matter" });
                            return;
                        }
                        onChange({
                            ...value,
                            language: (newValue as IOptionLanguage).value,
                        });
                    }
                }}
                onBlur={() => {

                }}
            />
            <SelectField
                className={styles.levels}
                name="langLevels"
                label={t("whoNeeds.Уровень владения")}
                options={allLevels}
                value={getObjectFromValue(value.level, allLevels)}
                onChange={(newValue: unknown) => {
                    if (typeof newValue === "object" && newValue !== null && "value" in newValue) {
                        if (value.language === "not_matter") return;
                        onChange({
                            ...value,
                            level: (newValue as IOptionLevelLanguage).value,
                        });
                    }
                }}
            />
            {close}
        </div>
    );
};

export default Languages;
