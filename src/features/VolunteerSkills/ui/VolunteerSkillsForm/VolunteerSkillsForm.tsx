import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./VolunteerSkillsForm.module.scss";
import { SkillsForm } from "@/features/SkillsForm";
import { useForm } from "react-hook-form";

export const VolunteerSkillsForm: FC = memo(() => {
    const { t } = useTranslation();
    const { handleSubmit, control } = useForm<OfferWhatToDoFormFields>({
        mode: "onChange",
        defaultValues,
    });

    return (
        <div className={styles.wrapper}>
            <SkillsForm control={control}/>
        </div>
    );
});
