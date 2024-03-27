import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import SelectField from "@/components/SelectField/SelectField";
import { IOptionLanguage, IOptionLevelLanguage } from "@/types/select";

import { LevelLanguage } from "@/entities/Offer/model/types/offerWhoNeeds";

import { useAllLangs, useLangsLevels } from "./Languages.data";
import { LanguagesProps } from "./types";
import styles from "./Languages.module.scss";

const Languages: FC<LanguagesProps> = (props) => {
    const { close, value, onChange } = props;
    const { t } = useTranslation("offer");
    const allLangs = useAllLangs();
    const allLevels = useLangsLevels();

    const getObjectFromValue = (
        valueObject: string | LevelLanguage,
        options: IOptionLanguage[] | IOptionLevelLanguage[],
    ) => options.find((option) => option.value === valueObject);

    return (
        <div className={styles.wrapper}>
            <SelectField
                className={styles.all}
                name="allLangs"
                label={t("whoNeeds.Знание языков")}
                options={allLangs}
                value={getObjectFromValue(value.language, allLangs)}
                onChange={(newValue: unknown) => {
                    if (typeof newValue === "object" && newValue !== null && "value" in newValue) {
                        onChange({
                            ...value,
                            language: (newValue as IOptionLanguage).value,
                        });
                    }
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
