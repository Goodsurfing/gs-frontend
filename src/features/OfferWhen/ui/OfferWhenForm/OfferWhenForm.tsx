import { memo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";

import { OfferWhenRequests } from "../OfferWhenRequests/OfferWhenRequests";
import { OfferWhenPeriods } from "../OfferWhenPeriods/OfferWhenPeriods";
import { OfferWhenSlider } from "../OfferWhenSlider/OfferWhenSlider";
import { OfferWhenTimeSettings } from "../OfferWhenTimeSettings/OfferWhenTimeSettings";

import { OfferWhen } from "@/entities/Offer";

import styles from "./OfferWhenForm.module.scss";

interface OfferWhenFormProps {
    onComplete?: () => void;
}

export const OfferWhenForm = memo(({ onComplete }: OfferWhenFormProps) => {
    const onSubmit: SubmitHandler<OfferWhen> = async (data) => {
        console.log(data);
        onComplete?.();
    };

    const { handleSubmit, control } = useForm<OfferWhen>({
        mode: "onChange",
    });

    return (
        <form className={styles.form}>
            <OfferWhenPeriods />
            <OfferWhenTimeSettings />
            <OfferWhenSlider />
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
