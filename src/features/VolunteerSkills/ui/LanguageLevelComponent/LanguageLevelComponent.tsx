import { MenuItem } from "@mui/material";
import React, { FC, memo } from "react";

import { SelectComponent } from "@/shared/ui/Select/Select";

import {
    LanguageLevelOptions,
    LanguageOptions,
    LanguageSkills,
} from "../../model/types/volunteerSkills";
import styles from "./LanguageLevelComponent.module.scss";

const LanguagesOptions: LanguageOptions[] = [
    { value: "english", text: "Английский" },
    { value: "spanish", text: "Испанский" },
    { value: "russian", text: "Русский" },
];
const LevelOptions: LanguageLevelOptions[] = [
    { value: "beginner", text: "Начальный" },
    { value: "intermediate", text: "Средний" },
    { value: "proficient", text: "Хороший" },
    { value: "fluent", text: "Разговорный" },
];

interface LanguageLevelComponentProps {
    className?: string;
    value: LanguageSkills;
    onChange: (value: LanguageSkills) => void;
}

export const LanguageLevelComponent: FC<LanguageLevelComponentProps> = memo(
    (props: LanguageLevelComponentProps) => {
        const { className, value, onChange } = props;

        const handleLanguageChange = (item: LanguageSkills) => {
            onChange({ ...value, language: item.language. });
        };
        const handleLevelChange = (item: LanguageSkills) => {
            onChange({ ...value, level: item.level });
        };

        return (
            <div className={styles.wrapper}>
                <div>
                    <span className={styles.titleSelect}>Знание языков</span>
                    <SelectComponent
                        className={styles.select}
                        onChange={(e) => { handleLanguageChange(e.target.value); }}
                        value={value.language.value}
                    >
                        {LanguagesOptions.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                                {item.text}
                            </MenuItem>
                        ))}
                    </SelectComponent>
                </div>
                <div>
                    <span className={styles.titleSelect}>Уровень владения</span>
                    <SelectComponent
                        className={styles.select}
                        onChange={() => {}}
                        value={value}
                    >
                        {LevelOptions.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                                {item.text}
                            </MenuItem>
                        ))}
                    </SelectComponent>
                </div>
            </div>
        );
    },
);
