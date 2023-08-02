import { memo } from "react";
import { useTranslation } from "react-i18next";

import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";
import styles from "./OfferWhatToDoForm.module.scss";

import { Skills } from "../Skills/Skills";
import { OfferWhatToDoFormFields } from "../../model/types/offerWhatToDo";
import Textarea from "@/shared/ui/Textarea/Textarea";
import { AdditionalSkills } from "../AdditionalSkills/AdditionalSkills";
import { WorkingHoursField } from "../WorkingHoursField/WorkingHoursField";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOffs: 2, hours: 6, timeType: "week" },
};

export const OfferWhatToDoForm = memo(({ onSuccess }: OfferWhatToDoFormProps) => {
    const { handleSubmit, control } = useForm<OfferWhatToDoFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const { t } = useTranslation();

    const onSubmit: SubmitHandler<OfferWhatToDoFormFields> = (data) => {
        console.log(data);
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <p className={styles.skillsText}>{t("Навыки, которыми должен обладать волонтер")}</p>
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
            <Controller
                name="workingHours"
                control={control}
                render={({ field }) => (
                    <WorkingHoursField value={field.value} onChange={field.onChange} />
                )}
            />
            <Controller
                name="extraInfo"
                control={control}
                render={({ field }) => (
                    <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        label={t("Дополнительная информация")}
                        description={t("Не более 1000 знаков")}
                    />
                )}
            />
        </form>
    );
});
