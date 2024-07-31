import cn from "classnames";
import { memo, useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    useForm,
} from "react-hook-form";

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { offerConditionsAdapter, offerConditionsApiAdapter } from "../../lib/offerConditionsAdapter";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useGetOfferByIdQuery, useUpdateOfferMutation } from "@/entities/Offer/api/offerApi";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { useConfirmNavigation } from "@/shared/hooks/useConfirmNavigation";
import { ErrorType } from "@/types/api/error";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { getErrorText } from "@/shared/lib/getErrorText";
import { NOT_SELECTED } from "@/shared/constants/messages";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";

interface OfferConditionsFormProps {
    onSuccess?: () => void;
    className?: string;
}

const defaultValues: DefaultValues<OfferConditionsFormFields> = defaultFormFields;

export const OfferConditionsForm = memo((props: OfferConditionsFormProps) => {
    const { onSuccess, className } = props;
    const { id } = useParams();
    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const { data: getOfferData, isLoading: isOfferDataLoading } = useGetOfferByIdQuery(id || "");
    const [toast, setToast] = useState<ToastAlert>();
    const { t } = useTranslation("offer");

    const {
        control, handleSubmit,
        reset, formState: { isDirty, errors },
    } = useForm<OfferConditionsFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit = handleSubmit((data) => {
        const preparedData = offerConditionsApiAdapter(data);
        setToast(undefined);
        updateOffer({ id: Number(id), body: { conditions: preparedData } })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Данные успешно изменены",
                    type: HintType.Success,
                });
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
        onSuccess?.();
    });

    useEffect(() => {
        if (getOfferData?.conditions) {
            reset(offerConditionsAdapter(getOfferData?.conditions));
        }
    }, [getOfferData?.conditions, reset]);

    const {
        isModalOpen,
        handleConfirmClick,
        handleModalClose,
    } = useConfirmNavigation(onSubmit, isDirty);

    if (isOfferDataLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                <Preloader />
            </div>
        );
    }

    return (
        <form className={cn(styles.wrapper, className)}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Controller
                name="housing"
                control={control}
                rules={{
                    validate: (value) => {
                        if (value.switchState && value.housing.length === 0) {
                            return NOT_SELECTED;
                        }
                        return true;
                    },
                }}
                render={({ field }) => (
                    <div>
                        <ConditionsHousing
                            value={field.value}
                            onChange={field.onChange}
                        />
                        {errors.housing && (
                            <ErrorText text={errors.housing.message?.toString()} />
                        )}
                    </div>
                )}
            />
            <Controller
                name="nutrition"
                control={control}
                rules={{
                    validate: (value) => {
                        if (value.switchState && value.nutrition.length === 0) {
                            return NOT_SELECTED;
                        }
                        return true;
                    },
                }}
                render={({ field }) => (
                    <div>
                        <ConditionsNutrition
                            value={field.value}
                            onChange={field.onChange}
                        />
                        {errors.nutrition && (
                            <ErrorText text={errors.nutrition.message?.toString()} />
                        )}
                    </div>
                )}
            />
            <Controller
                name="travel"
                control={control}
                rules={{
                    validate: (value) => {
                        if (value.switchState && value.travel.length === 0) {
                            return NOT_SELECTED;
                        }
                        return true;
                    },
                }}
                render={({ field }) => (
                    <div>
                        <ConditionsTravel
                            value={field.value}
                            onChange={field.onChange}
                        />
                        {errors.travel && (
                            <ErrorText text={errors.travel.message?.toString()} />
                        )}
                    </div>
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
                    <Textarea className={styles.textarea} value={field.value} onChange={field.onChange} label={t("conditions.Дополнительные условия")} description={t("conditions.Не более 1000 знаков")} />
                )}
            />
            <div>
                <Button
                    disabled={isLoading}
                    onClick={onSubmit}
                    variant="FILL"
                    type="submit"
                    color="BLUE"
                    size="MEDIUM"
                >
                    Сохранить
                </Button>
            </div>
            <ConfirmActionModal
                description="Изменения не были сохранены"
                onConfirm={handleConfirmClick}
                onClose={handleModalClose}
                confirmTextButton="Сохранить"
                isModalOpen={isModalOpen}
            />
        </form>
    );
});
