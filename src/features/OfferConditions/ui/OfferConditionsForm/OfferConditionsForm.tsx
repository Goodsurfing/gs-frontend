import { memo } from "react";
import cn from "classnames";
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

interface OfferConditionsFormProps {
    onSuccess?: () => void;
    className?: string;
}

const defaultValues: DefaultValues<OfferConditionsFormFields> = {
    housing: {
        switchState: true,
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
        </form>
    );
});
