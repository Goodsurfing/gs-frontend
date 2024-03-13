import cn from "classnames";
import { memo, useState } from "react";
import {
    Controller,
    DefaultValues,
    SubmitHandler,
    useForm,
} from "react-hook-form";

import { useParams } from "react-router-dom";
import type { OfferConditionsFormFields } from "../../model/types/offerConditions";

import { defaultFormFields } from "../../model/data/defaultFormFields";

import { ConditionsHousing } from "../ConditionsHousing/ConditionsHousing";
import { ConditionsNutrition } from "../ConditionsNutrition/ConditionsNutrition";
import { ConditionsTravel } from "../ConditionsTravel/ConditionsTravel";
import { ConditionsFacilities } from "../ConditionsFacilities/ConditionsFacilities";
import { ConditionsExtraFeatures } from "../ConditionsExtraFeatures/ConditionsExtraFeatures";
import { ConditionsPayment } from "../ConditionsPayment/ConditionsPayment";

import Textarea from "@/shared/ui/Textarea/Textarea";
import Button from "@/shared/ui/Button/Button";

import styles from "./OfferConditionsForm.module.scss";
import { offerConditionsApiAdapter } from "../../lib/offerConditionsAdapter";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useUpdateConditionsMutation } from "@/entities/Offer/api/offerApi";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface OfferConditionsFormProps {
    onSuccess?: () => void;
    className?: string;
}

const defaultValues: DefaultValues<OfferConditionsFormFields> = defaultFormFields;

export const OfferConditionsForm = memo((props: OfferConditionsFormProps) => {
    const { onSuccess, className } = props;
    const [updateConditions, { isLoading }] = useUpdateConditionsMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { id } = useParams();

    const { control, handleSubmit } = useForm<OfferConditionsFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit: SubmitHandler<OfferConditionsFormFields> = (data) => {
        const preparedData = offerConditionsApiAdapter(data);
        console.log(preparedData);
        setToast(undefined);
        updateConditions({ body: { id, conditions: preparedData } })
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
        <form className={cn(styles.wrapper, className)}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Controller
                name="housing"
                control={control}
                render={({ field }) => (
                    <ConditionsHousing
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                name="nutrition"
                control={control}
                render={({ field }) => (
                    <ConditionsNutrition
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                name="travel"
                control={control}
                render={({ field }) => (
                    <ConditionsTravel
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                name="facilities"
                control={control}
                render={({ field }) => (
                    <ConditionsFacilities
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                name="extraFeatures"
                control={control}
                render={({ field }) => (
                    <ConditionsExtraFeatures
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                name="payment"
                control={control}
                render={({ field }) => (
                    <ConditionsPayment
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                name="extraConditions"
                control={control}
                render={({ field }) => (
                    <Textarea className={styles.textarea} value={field.value} onChange={field.onChange} label="Дополнительные условия" description="Не более 1000 знаков" />
                )}
            />
            <div>
                <Button
                    disabled={isLoading}
                    onClick={handleSubmit(onSubmit)}
                    variant="FILL"
                    type="submit"
                    color="BLUE"
                    size="MEDIUM"
                >
                    Сохранить
                </Button>
            </div>
        </form>
    );
});
