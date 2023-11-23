import { MenuItem } from "@mui/material";
import cn from "classnames";
import React, {
    FC, memo, useTransition, useState, useMemo,
} from "react";

import plusIcon from "@/shared/assets/icons/plus-icon.svg";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";

import { LanguageSkills } from "../../model/types/volunteerSkills";
import { LanguageLevelComponent } from "../LanguageLevelComponent/LanguageLevelComponent";
import styles from "./VolunteerLanguage.module.scss";

interface VolunteerLanguageProps {
    value: LanguageSkills[];
    onChange: (value: LanguageSkills[]) => void;
    className?: string;
}

export const VolunteerLanguage: FC<VolunteerLanguageProps> = memo(
    (props: VolunteerLanguageProps) => {
        const { className, value, onChange } = props;
        const [languageSkills, setLanguageSkills] = useState<LanguageSkills[]>([]);
        const { t } = useTransition();

        const addLanguage = () => {
            setLanguageSkills([...languageSkills, { language: "", level: "" }]);
        };

        const updateLanguage = (index: number, field: keyof LanguageSkills, value: string) => {
            const newLanguages = [...languageSkills];
            newLanguages[index][field] = value;
            setLanguageSkills(newLanguages);
        };

        const renderLanguageLevelComponents = useMemo(() => {
            value.map((item, index) => (
                <LanguageLevelComponent
                    key={index}
                    value={item}
                    onChange
                />
            ));
        }, [value]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <LanguageLevelComponent value={} />
                <div className={styles.container}>{renderLanguageLevelComponents}</div>
                <IconButtonComponent icon={plusIcon} text="Добавить язык" />
            </div>
        );
    },
);
