import { MenuItem } from "@mui/material";
import React, { FC, memo } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { SelectComponent } from "@/shared/ui/Select/Select";

import { IOptionLevelLanguage, IOptionLanguage } from "@/types/select";
import {
    LanguageSkills,
} from "../../model/types/volunteerSkills";
import styles from "./LanguageLevelComponent.module.scss";
import { useAllLangsFilter, useLangsLevelsFilter } from "@/shared/data/languages";

interface LanguageLevelComponentProps {
    className?: string;
    value?: LanguageSkills;
    onChange: (value: LanguageSkills) => void;
    isTitle?: boolean
}

export const LanguageLevelComponent: FC<LanguageLevelComponentProps> = memo(
    (props: LanguageLevelComponentProps) => {
        const {
            className, value, onChange, isTitle = true,
        } = props;
        const { t } = useTranslation("volunteer");
        const allLangs = useAllLangsFilter();
        const allLevels = useLangsLevelsFilter();

        const handleLanguageChange = (language: IOptionLanguage) => {
            onChange({ ...value, language });
        };
        const handleLevelChange = (level: IOptionLevelLanguage) => {
            onChange({ ...value, level });
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.selectContainer}>
                    {isTitle && <span className={styles.titleSelect}>{t("volunteer-skills.Знание языков")}</span>}
                    <SelectComponent
                        className={styles.select}
                        onChange={(e) => {
                            handleLanguageChange(
                                e.target.value as IOptionLanguage,
                            );
                        }}
                        value={value ? value.language : ""}
                    >
                        {allLangs.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </SelectComponent>
                </div>
                <div className={styles.selectContainer}>
                    {isTitle && <span className={styles.titleSelect}>{t("volunteer-skills.Уровень владения")}</span>}
                    <SelectComponent
                        className={styles.select}
                        onChange={(e) => {
                            handleLevelChange(
                                e.target.value as IOptionLevelLanguage,
                            );
                        }}
                        value={value ? value.level : ""}
                    >
                        {allLevels.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </SelectComponent>
                </div>
            </div>
        );
    },
);
