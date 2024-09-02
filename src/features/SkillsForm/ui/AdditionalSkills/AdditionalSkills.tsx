import cn from "classnames";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import { plusIcon } from "@/shared/data/icons/helpIcons";
import { successIcon } from "@/shared/data/icons/skills";
import { EditableInputWithButton } from "@/shared/ui/EditableInputWithButton/EditableInputWithButton";
import { InputWithButton } from "@/shared/ui/InputWithButton/InputWithButton";

import { AdditionalSkillsType } from "@/features/OfferWhatToDo";
import styles from "./AdditionalSkills.module.scss";

interface Props {
    className?: string;
    value: AdditionalSkillsType[];
    onChange: (value: AdditionalSkillsType[]) => void;
}

export const AdditionalSkills = memo(
    ({ className, onChange, value }: Props) => {
        const [inputValue, setInputValue] = useState("");
        const { t } = useTranslation("volunteer");

        const onSkillValueChange = (skillValue: string, prevValue: string) => {
            onChange(
                value.map((skill) => {
                    if (skill.text === prevValue) {
                        return { ...skill, text: skillValue };
                    }
                    return skill;
                }),
            );
        };

        const onAddSkill = (skill: string) => {
            if (value.length >= 10) return;
            if (skill) {
                if (value.find((item) => item.text === skill)) {
                    return;
                }
                onChange([...value, { text: skill }]);
                setInputValue("");
            }
        };

        const onSkillDelete = (skillValue: string) => {
            onChange(value.filter((skill) => skill.text !== skillValue));
        };

        return (
            <div className={cn(styles.wrapper, className)}>
                {value.map((skill) => (
                    <div key={skill.text} className={styles.skills}>
                        <EditableInputWithButton
                            value={skill.text}
                            onValueChange={(text) => onSkillValueChange(text, skill.text)}
                            onClose={() => onSkillDelete(skill.text)}
                            iconButtonClassName={styles.skillIcon}
                            buttonIcon={successIcon}
                        />
                    </div>
                ))}
                <InputWithButton
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={onAddSkill}
                    className={styles.addSkill}
                    iconButtonClassName={styles.icon}
                    inputButtonClassName={styles.inputIcon}
                    buttonIcon={successIcon}
                    inputButtonIcon={plusIcon}
                    placeholder={t("volunteer-skills.Добавить навык")}
                />
            </div>
        );
    },
);
