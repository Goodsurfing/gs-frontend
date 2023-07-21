import { memo } from "react";
import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";

import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";

import { OfferWhenRequests } from "../OfferWhenRequests/OfferWhenRequests";
import { OfferWhenPeriods } from "../OfferWhenPeriods/OfferWhenPeriods";
import { OfferWhenSlider } from "../OfferWhenSlider/OfferWhenSlider";
import { OfferWhenTimeSettings } from "../OfferWhenTimeSettings/OfferWhenTimeSettings";

import type { DatePeriods, OfferWhenFields } from "../../model/types/offerWhen";

import styles from "./OfferWhenForm.module.scss";

interface OfferWhenFormProps {
    onComplete?: () => void;
}

const initialSliderValue: number[] = [7, 186];
const initialPeriods: DatePeriods[] = [
    { from: new Date(), to: new Date() }
];


const defaultValues: DefaultValues<OfferWhenFields> = {
    participationPeriod: initialSliderValue,
    periods: initialPeriods,
};

export const OfferWhenForm = memo(({ onComplete }: OfferWhenFormProps) => {
    const onSubmit: SubmitHandler<OfferWhenFields> = async (data) => {
        console.log(data);
        onComplete?.();
    };

    const { handleSubmit, control } = useForm<OfferWhenFields>({
        mode: "onChange",
        defaultValues,
    });

    return (
        <form className={styles.form}>
            <Controller
                name="periods"
                control={control}
                render={({ field }) => (
                    <OfferWhenPeriods
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <OfferWhenTimeSettings />
            <Controller
                name="participationPeriod"
                control={control}
                render={({ field }) => (
                    <OfferWhenSlider
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <OfferWhenRequests />
            <Button
                onClick={handleSubmit(onSubmit)}
                className={styles.btn}
                rounded
                variant={Variant.PRIMARY}
            >
                Сохранить
            </Button>
        </form>
    );
});
