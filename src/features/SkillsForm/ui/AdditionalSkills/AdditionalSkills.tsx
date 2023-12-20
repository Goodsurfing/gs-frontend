import cn from "classnames";
import { memo, useState } from "react";
import { successIcon } from "@/shared/data/icons/skills";
import { plusIcon } from "@/shared/data/icons/helpIcons";

import styles from "./AdditionalSkills.module.scss";
import { AdditionalSkillsType } from "../../model/types/offerWhatToDo";
import { InputWithButton } from "@/shared/ui/InputWithButton/InputWithButton";
import { EditableInputWithButton } from "@/shared/ui/EditableInputWithButton/EditableInputWithButton";

interface Props {
    className?: string;
    value: AdditionalSkillsType[];
    onChange: (value: AdditionalSkillsType[]) => void;
}

export const AdditionalSkills = memo(({ className, onChange, value }: Props) => {
    const [inputValue, setInputValue] = useState("");

    const onSkillValueChange = (skillValue: string, prevValue: string) => {
        onChange(value.map((skill) => {
            if (skill.text === prevValue) {
                return { ...skill, text: skillValue };
            }
            return skill;
        }));
    };

    const onAddSkill = (skill: string) => {
        if (value.find((item) => item.text === skill)) {
            return;
        }
        onChange([...value, { text: skill }]);
        setInputValue("");
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
                placeholder="Добавить навык"
            />
        </div>
    );
});