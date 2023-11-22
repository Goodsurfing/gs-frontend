import React, { FC, memo } from "react";
import { Control, Controller } from "react-hook-form";

import { OfferWhatToDoFormFields } from "@/features/OfferWhatToDo/model/types/offerWhatToDo";

import styles from "./SkillsForm.module.scss";
import { Skills } from "../Skills/Skills";
import { AdditionalSkills } from "../AdditionalSkills/AdditionalSkills";

interface SkillsFormProps {
    control: Control<OfferWhatToDoFormFields>;
}

export const SkillsForm: FC<SkillsFormProps> = memo((
    props: SkillsFormProps,
) => {
    const { control } = props;
    return (
        <div className={styles.wrapper}>
            <div className={styles.skillsWrapper}>
                <Controller
                    name="skills"
                    control={control}
                    render={({ field }) => (
                        <Skills
                            className={styles.skills}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>
            <Controller
                name="additionalSkills"
                control={control}
                render={({ field }) => (
                    <AdditionalSkills
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
        </div>
    );
});
