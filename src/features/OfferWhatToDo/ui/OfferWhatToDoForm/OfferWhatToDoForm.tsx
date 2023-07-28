import { memo } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styles from "./OfferWhatToDoForm.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

import { Skills } from "../Skills/Skills";
import { OfferWhatToDo } from "../../model/types/offerWhatToDo";
import Textarea from "@/shared/ui/Textarea/Textarea";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

export const OfferWhatToDoForm = memo(({ onSuccess }: OfferWhatToDoFormProps) => {
    const { t } = useLocale();

    const { handleSubmit, reset, control } = useForm<OfferWhatToDo>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<OfferWhatToDo> = (data) => {
        console.log(data);
    };

    const handleSkillsChange = () => {};

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <Controller
                name=""
                control={control}
                render={({ field }) => (
                    <Skills value={field.value} onChange={field.onChange} />
                )}
            />
            <Controller
                name=""
                control={control}
            />
            <Controller
                name=""
                control={control}
                // render={({ field }) => (

                // )}
            /> 
            <Controller
                name=""
                control={control}
                // render={({ field }) => (

                // )}
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
