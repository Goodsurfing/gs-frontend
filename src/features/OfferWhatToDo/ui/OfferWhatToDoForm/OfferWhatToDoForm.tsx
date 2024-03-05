import { memo, useState } from "react";
import {
    Controller,
    DefaultValues,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import { SkillsForm } from "@/features/SkillsForm";

import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { OfferWhatToDoFormFields } from "../../model/types/offerWhatToDo";
import { WorkingHoursField } from "../WorkingHoursField/WorkingHoursField";
import styles from "./OfferWhatToDoForm.module.scss";
import { offerWhatToDoApiAdapter } from "../../model/lib/offerWhatToDoAdapter";
import { useUpdateWhatToDoMutation } from "@/entities/Offer/api/offerApi";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOff: 2, hours: 6, timeType: "week" },
};

export const OfferWhatToDoForm = memo(
    ({ onSuccess }: OfferWhatToDoFormProps) => {
        const { handleSubmit, control } = useForm<OfferWhatToDoFormFields>({
            mode: "onChange",
            defaultValues,
        });
        const [updateWhatToDo, { isError, isLoading }] = useUpdateWhatToDoMutation();
        const [toast, setToast] = useState<ToastAlert>();
        const { id } = useParams();

        const { t } = useTranslation();

        const onSubmit: SubmitHandler<OfferWhatToDoFormFields> = async (data) => {
            const preparedData = offerWhatToDoApiAdapter(data);
            await updateWhatToDo({ body: { id, ...preparedData } })
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Данные успешно изменены",
                        type: HintType.Success,
                    });
                })
                .catch(() => {
                    setToast({
                        text: "Некорректно введены данные",
                        type: HintType.Error,
                    });
                });
            onSuccess?.();
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
                {isError && toast && (
                    <HintPopup text={toast.text} type={toast.type} />
                )}
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
                        disabled={isLoading}
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
