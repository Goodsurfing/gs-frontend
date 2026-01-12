import cn from "classnames";
import {
    memo, useState,
} from "react";
import {
    Controller,
    DefaultValues,
    useForm,
} from "react-hook-form";

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { OfferConditionsFormFields } from "../../model/types/offerConditions";

import { defaultFormFields } from "../../model/data/defaultFormFields";

import { ConditionsHousing } from "../ui/ConditionsHousing/ConditionsHousing";
import { ConditionsNutrition } from "../ui/ConditionsNutrition/ConditionsNutrition";
import { ConditionsTravel } from "../ui/ConditionsTravel/ConditionsTravel";
import { ConditionsFacilities } from "../ui/ConditionsFacilities/ConditionsFacilities";
import { ConditionsExtraFeatures } from "../ui/ConditionsExtraFeatures/ConditionsExtraFeatures";
import { ConditionsPayment } from "../ui/ConditionsPayment/ConditionsPayment";

import Textarea from "@/shared/ui/Textarea/Textarea";
import Button from "@/shared/ui/Button/Button";

import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    NOT_SELECTED,
} from "@/shared/constants/messages";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { useLocale } from "@/app/providers/LocaleProvider";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getOffersFinishingTouchesPageUrl } from "@/shared/config/routes/AppUrls";
import { useGetPublicFoodsQuery, useGetPublicHousesQuery, useGetPublicTransfersQuery } from "@/entities/Admin";
import styles from "./AdminOfferConditionsForm.module.scss";

interface AdminOfferConditionsFormProps {
    onSuccess?: () => void;
    className?: string;
}

const defaultValues: DefaultValues<OfferConditionsFormFields> = defaultFormFields;

export const AdminOfferConditionsForm = memo((props: AdminOfferConditionsFormProps) => {
    const {
        control, handleSubmit, formState: { errors },
    } = useForm<OfferConditionsFormFields>({
        mode: "onChange",
        defaultValues,
    });
    const { onSuccess, className } = props;
    const { id } = useParams();
    const { locale } = useLocale();

    const { data: foodsData = [], isLoading: isFoodLoading } = useGetPublicFoodsQuery();
    const { data: housesData = [], isLoading: isHouseLoading } = useGetPublicHousesQuery();
    const { data: transfersData = [], isLoading: isTransferLoading } = useGetPublicTransfersQuery();
    const [toast, setToast] = useState<ToastAlert>();
    const { t } = useTranslation("offer");

    const onSubmit = handleSubmit(async () => {
        setToast(undefined);
        onSuccess?.();
    });

    // useEffect(() => {
    //     if (getOfferData?.conditions) {
    //         reset(offerConditionsAdapter(getOfferData?.conditions));
    //     }
    // }, [getOfferData?.conditions, reset]);

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
                            houseData={housesData}
                            isLoading={isHouseLoading}
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
                            foodData={foodsData}
                            isLoading={isFoodLoading}
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
                            transferData={transfersData}
                            isLoading={isTransferLoading}
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
            <div className={styles.buttons}>
                <Button
                    onClick={onSubmit}
                    variant="FILL"
                    type="submit"
                    color="BLUE"
                    size="MEDIUM"
                >
                    Сохранить
                </Button>
                <ButtonLink
                    path={getOffersFinishingTouchesPageUrl(locale, id ?? "")}
                    size="MEDIUM"
                    type="outlined"
                >
                    {t("Дальше")}
                </ButtonLink>
            </div>
        </form>
    );
});
