import React, { FC, memo } from "react";
import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SkillsForm } from "@/features/SkillsForm";

import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { VolunteerSkillsField } from "../../model/types/volunteerSkills";
import { VolunteerLanguage } from "../VolunteerLanguage/VolunteerLanguage";
import styles from "./VolunteerSkillsForm.module.scss";

// Change typing
const defaultValues: DefaultValues<VolunteerSkillsField> = {
    languages: [],
    skills: [],
    additionalSkills: [],
};

export const VolunteerSkillsForm: FC = memo(() => {
    const { t } = useTranslation("volunteer");
    const { handleSubmit, control } = useForm<VolunteerSkillsField>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit: SubmitHandler<VolunteerSkillsField> = () => {

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <Controller
                name="languages"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                    <VolunteerLanguage
                        className={styles.language}
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <span className={styles.titleSkills}>{t("volunteer-skills.Навыки которыми вы обладаете")}</span>
            <SkillsForm control={control} />
            <Controller
                name="extraInfo"
                control={control}
                rules={{ required: false, maxLength: 1000 }}
                render={({ field }) => (
                    <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        label={t("volunteer-skills.Дополнительная информация")}
                        description={t("volunteer-skills.Не более 1000 знаков")}
                    />
                )}
            />
            <Button type="submit" color="BLUE" size="MEDIUM" variant="FILL">
                {t("volunteer-skills.Сохранить")}
            </Button>
        </form>
    );
});
