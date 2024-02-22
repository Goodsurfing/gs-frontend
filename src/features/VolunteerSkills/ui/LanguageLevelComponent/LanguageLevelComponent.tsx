import { MenuItem } from "@mui/material";
import React, { FC, memo } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { SelectComponent } from "@/shared/ui/Select/Select";

import {
    LanguageLevelOptions,
    LanguageOptions,
    LanguageSkills,
} from "../../model/types/volunteerSkills";
import styles from "./LanguageLevelComponent.module.scss";

const LanguagesOptions: LanguageOptions[] = ["english", "spanish", "russian"];
const LevelOptions: LanguageLevelOptions[] = [
    "beginner",
    "intermediate",
    "proficient",
    "fluent",
];

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

        const handleLanguageChange = (language: LanguageOptions) => {
            onChange({ ...value, language });
        };
        const handleLevelChange = (level: LanguageLevelOptions) => {
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
                                e.target.value as LanguageOptions,
                            );
                        }}
                        value={value ? value.language : ""}
                    >
                        {LanguagesOptions.map((item, index) => (
                            <MenuItem key={index} value={item}>
                                {t(`volunteer-skills.${item}`)}
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
                                e.target.value as LanguageLevelOptions,
                            );
                        }}
                        value={value ? value.level : ""}
                    >
                        {LevelOptions.map((item, index) => (
                            <MenuItem key={index} value={item}>
                                {t(`volunteer-skills.${item}`)}
                            </MenuItem>
                        ))}
                    </SelectComponent>
                </div>
            </div>
        );
    },
);
