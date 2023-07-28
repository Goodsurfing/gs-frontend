import { memo } from "react";
import { useTranslation } from "react-i18next";

import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";
import styles from "./OfferWhatToDoForm.module.scss";

import { Skills } from "../Skills/Skills";
import { OfferWhatToDoFormFields } from "../../model/types/offerWhatToDo";
import Textarea from "@/shared/ui/Textarea/Textarea";
import { Text } from "@/shared/ui/Text/Text";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOff: 2, hours: 6, timeType: "week" },
};

export const OfferWhatToDoForm = memo(({ onSuccess }: OfferWhatToDoFormProps) => {
    const { handleSubmit, control } = useForm<OfferWhatToDoFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const { t } = useTranslation();

    const onSubmit: SubmitHandler<OfferWhatToDoFormFields> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <div className={styles.skillsWrapper}>
                <p className={styles.skillsText}>{t("Навыки, которыми должен обладать волонтер")}</p>
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
