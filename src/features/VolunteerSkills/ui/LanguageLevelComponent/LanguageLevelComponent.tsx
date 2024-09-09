import { MenuItem } from "@mui/material";
import React, { FC, memo } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { SelectComponent } from "@/shared/ui/Select/Select";

import styles from "./LanguageLevelComponent.module.scss";
import { useAllLangsFilter, useLangsLevelsFilter } from "@/shared/data/languages";
import { Language, LevelLanguage } from "@/types/languages";

interface LanguageLevelComponentProps {
    className?: string;
    value?: Language;
    onChange: (value: Language) => void;
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

        const handleLanguageChange = (language: string) => {
            if (value) {
                onChange({ ...value, language });
            }
        };
        const handleLevelChange = (level: LevelLanguage) => {
            if (value) {
                onChange({ ...value, languageLevel: level });
            }
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.selectContainer}>
                    {isTitle && <span className={styles.titleSelect}>{t("volunteer-skills.Знание языков")}</span>}
                    <SelectComponent
                        className={styles.select}
                        onChange={(e) => {
                            handleLanguageChange(
                                e.target.value as string,
                            );
                        }}
                        value={value?.language || ""}
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
                                e.target.value as LevelLanguage,
                            );
                        }}
                        value={value?.languageLevel || ""}
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
