import React, { memo } from "react";
import {
    Control, Controller, FieldValues, Path,
} from "react-hook-form";

import { AdditionalSkills } from "../AdditionalSkills/AdditionalSkills";
import { Skills } from "../Skills/Skills";
import styles from "./SkillsForm.module.scss";
import { useGetPublicSkillsQuery } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

// Форма-родитель любая (вакансия, профиль волонтёра), лишь бы в ней были
// поля skills и additionalSkills. Обобщённый тип нужен с react-hook-form 7.5x:
// Control стал инвариантным, и Control<any> больше не принимает конкретные формы.
interface SkillsFormProps<T extends FieldValues> {
    control: Control<T>;
    locale: Locale;
}

const SkillsFormInner = <T extends FieldValues>(props: SkillsFormProps<T>) => {
    const { control, locale } = props;
    const { data: skillsData, isLoading } = useGetPublicSkillsQuery({ lang: locale });

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    if (!skillsData) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.skillsWrapper}>
                <Controller
                    name={"skills" as Path<T>}
                    control={control}
                    render={({ field }) => (
                        <Skills
                            skills={skillsData}
                            className={styles.skills}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>
            <Controller
                name={"additionalSkills" as Path<T>}
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
};

export const SkillsForm = memo(SkillsFormInner) as typeof SkillsFormInner;
