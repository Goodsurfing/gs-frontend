import { memo } from "react";
import {
    Controller,
    DefaultValues,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SkillsForm } from "@/features/SkillsForm";

import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { OfferWhatToDoFormFields } from "../../model/types/offerWhatToDo";
import { WorkingHoursField } from "../WorkingHoursField/WorkingHoursField";
import styles from "./OfferWhatToDoForm.module.scss";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOffs: 2, hours: 6, timeType: "week" },
};

export const OfferWhatToDoForm = memo(
    ({ onSuccess }: OfferWhatToDoFormProps) => {
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
                <p className={styles.skillsText}>
                    {t("Навыки, которыми должен обладать волонтер")}
                </p>
                <SkillsForm control={control} />
                <Controller
                    name="workingHours"
                    control={control}
                    render={({ field }) => (
                        <WorkingHoursField
                            value={field.value}
                            onChange={field.onChange}
                        />
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
    },
);
