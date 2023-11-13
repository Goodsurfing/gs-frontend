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
import Button from "@/shared/ui/Button/Button";

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

    const onSubmit: SubmitHandler<OfferWhatToDoFormFields> = () => {
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
            <div>
                <Button
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                    type="submit"
                >
                    Сохранить

                </Button>
            </div>
        </form>
    );
});
