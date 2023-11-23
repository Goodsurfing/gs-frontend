import React, { FC, memo } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SkillsForm } from "@/features/SkillsForm";

import Textarea from "@/shared/ui/Textarea/Textarea";

import { VolunteerSkillsField } from "../../model/types/volunteerSkills";
import { VolunteerLanguage } from "../VolunteerLanguage/VolunteerLanguage";
import styles from "./VolunteerSkillsForm.module.scss";
import Button from "@/shared/ui/Button/Button";

// Change typing
const defaultValues: DefaultValues<VolunteerSkillsField> = {
    languages: [],
    skills: [],
    additionalSkills: [],
};

export const VolunteerSkillsForm: FC = memo(() => {
    const { t } = useTranslation();
    const { handleSubmit, control } = useForm<VolunteerSkillsField>({
        mode: "onChange",
        defaultValues,
    });

    return (
        <div className={styles.wrapper}>
            <Controller
                name="languages"
                control={control}
                rules={{ required: true, maxLength: 1000 }}
                render={({ field }) => (
                    <VolunteerLanguage
                        className={styles.language}
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <span>Навыки которыми вы обладаете</span>
            <SkillsForm control={control} />
            <Controller
                name="extraInfo"
                control={control}
                rules={{ required: true, maxLength: 1000 }}
                render={({ field }) => (
                    <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        label={t("Дополнительная информация")}
                        description={t("Не более 1000 знаков")}
                    />
                )}
            />
            <Button color="BLUE" size="MEDIUM" variant="FILL">Сохранить</Button>
        </div>
    );
});
