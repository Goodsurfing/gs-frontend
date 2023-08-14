import { memo } from "react";

import cn from "classnames";

import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";

import { OfferFinishingTouchesFormFields } from "../../model/types/offerFinishingTouches";

import styles from "./OfferFinishingTouches.module.scss";
import Button from "@/shared/ui/Button/Button";
import { OfferFinishingTouchesExtras } from "../OfferFinishingTouchesExtras/OfferFinishingTouchesExtras";

interface OfferFinishingTouchesFormProps {
    className?: string;
}

const defaultValues: DefaultValues<OfferFinishingTouchesFormFields> = {};

export const OfferFinishingTouchesForm = memo((props: OfferFinishingTouchesFormProps) => {
    const { className } = props;

    const { handleSubmit, control } = useForm<OfferFinishingTouchesFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit: SubmitHandler<OfferFinishingTouchesFormFields> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.wrapper, className)}>
            <div className={styles.formFields}>
                <Controller
                    name="extraConditions"
                    control={control}
                    render={({ field }) => (
                        <OfferFinishingTouchesExtras
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>
            <div className={styles.submitBtns}>
                <Button
                    color="BLUE"
                    size="MEDIUM"
                    variant="FILL"
                >
                    Опубликовать
                </Button>
                <Button
                    color="BLUE"
                    size="MEDIUM"
                    variant="OUTLINE"
                >
                    Сохранить в черновики
                </Button>
            </div>
        </form>
    );
});
