import cn from "classnames";
import { memo } from "react";
import {
    Controller,
    DefaultValues,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { OfferConditionsFormFields } from "../../model/types/offerConditions";
import { ConditionsHousing } from "../ConditionsHousing/ConditionsHousing";

import styles from "./OfferConditionsForm.module.scss";
import { ConditionsNutrition } from "../ConditionsNutrition/ConditionsNutrition";

interface OfferConditionsFormProps {
    onSuccess?: () => void;
    className?: string;
}

const defaultValues: DefaultValues<OfferConditionsFormFields> = {
    housing: {
        switchState: true,
    },
    nutrition: {
        switchState: true,
        nutrition: [],
    },
};

export const OfferConditionsForm = memo((props: OfferConditionsFormProps) => {
    const { onSuccess, className } = props;
    const { t } = useTranslation();

    const { control, handleSubmit } = useForm<OfferConditionsFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit: SubmitHandler<OfferConditionsFormFields> = (data) => {
        console.log(data);
        onSuccess?.();
    };

    return (
        <form className={cn(styles.wrapper, className)} onSubmit={handleSubmit(onSubmit)}>
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
        </form>
    );
});
