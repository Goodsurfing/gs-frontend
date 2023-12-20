import React, { FC, memo } from "react";
import { Control, Controller } from "react-hook-form";

import { AdditionalSkills } from "../AdditionalSkills/AdditionalSkills";
import { Skills } from "../Skills/Skills";
import styles from "./SkillsForm.module.scss";

interface SkillsFormProps {
    control: Control<any>;
}

export const SkillsForm: FC<SkillsFormProps> = memo(
    (props: SkillsFormProps) => {
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
    },
);
