import { memo } from "react";
import { successIcon } from "@/shared/data/icons/skills";
import { plusIcon } from "@/shared/data/icons/helpIcons";

import styles from "./AdditionalSkills.module.scss";
import { AdditionalSkillsType } from "../../model/types/offerWhatToDo";
import { InputWithButton } from "@/shared/ui/InputWithButton/InputWithButton";

interface Props {
    className?: string;
    value: AdditionalSkillsType[];
    onChange: (value: AdditionalSkillsType[]) => void;
}

export const AdditionalSkills = memo(({ className, onChange, value }: Props) => {
    const onSkillsChange = (value: string) => {};

    const onSkillSubmit = (value: string) => {};

    return (
        <div className={styles.wrapper}>
            <InputWithButton
                className={styles.addSkill}
                iconButtonClassName={styles.icon}
                inputButtonClassName={styles.inputIcon}
                onSubmit={onSkillSubmit}
                icon={successIcon}
                inputButtonIcon={plusIcon}
                placeholder="Добавить навык"
            />
        </div>
    );
});
