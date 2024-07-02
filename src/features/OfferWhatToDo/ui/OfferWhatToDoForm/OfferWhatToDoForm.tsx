import { memo, useEffect, useState } from "react";
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
import { offerWhatToDoAdapter, offerWhatToDoApiAdapter } from "../../model/lib/offerWhatToDoAdapter";
import { useGetOfferByIdQuery, useUpdateOfferMutation } from "@/entities/Offer/api/offerApi";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./OfferWhatToDoForm.module.scss";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOff: 2, hours: 6, timeType: "week" },
    extraInfo: "",
};

export const OfferWhatToDoForm = memo(
    ({ onSuccess }: OfferWhatToDoFormProps) => {
        const { handleSubmit, control, reset } = useForm<OfferWhatToDoFormFields>({
            mode: "onChange",
            defaultValues,
        });
        const { id } = useParams();
        const [updateWhatToDo, { isLoading }] = useUpdateOfferMutation();
        const { data: getWhatToDo } = useGetOfferByIdQuery(id || "");
        const [toast, setToast] = useState<ToastAlert>();

        const { t } = useTranslation("offer");

        const onSubmit: SubmitHandler<OfferWhatToDoFormFields> = async (data) => {
            const preparedData = offerWhatToDoApiAdapter(data);
            setToast(undefined);
            updateWhatToDo({ id: Number(id), body: { whatToDo: preparedData } })
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

        useEffect(() => {
            if (getWhatToDo?.whatToDo) {
                reset(offerWhatToDoAdapter(getWhatToDo.whatToDo));
            }
        }, [getWhatToDo, reset]);

        return (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
                {toast && (
                    <HintPopup text={toast.text} type={toast.type} />
                )}
                <p className={styles.skillsText}>
                    {t("whatToDo.Навыки, которыми должен обладать волонтёр")}
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
                    rules={{ required: false, maxLength: 1000 }}
                    render={({ field }) => (
                        <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            label={t("whatToDo.Дополнительная информация")}
                            description={t("whatToDo.Не более 1000 знаков")}
                        />
                    )}
                />
                <div>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        type="submit"
                    >
                        {t("whatToDo.Сохранить")}
                    </Button>
                </div>
            </form>
        );
    },
);
