import { memo, useState } from "react";
import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";

import { useParams } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";

import { OfferWhenRequests } from "../OfferWhenRequests/OfferWhenRequests";
import { OfferWhenPeriods } from "../OfferWhenPeriods/OfferWhenPeriods";
import { OfferWhenSlider } from "../OfferWhenSlider/OfferWhenSlider";
import { OfferWhenTimeSettings } from "../OfferWhenTimeSettings/OfferWhenTimeSettings";

import type {
    DatePeriods, EndSettings, OfferWhenFields, TimeSettingsControls,
} from "../../model/types/offerWhen";

import styles from "./OfferWhenForm.module.scss";
import { offerWhenFormAdapter } from "../../lib/offerWhenFormAdapter";
import { useUpdateWhenMutation } from "@/entities/Offer/api/offerApi";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface OfferWhenFormProps {
    onComplete?: () => void;
}

const initialSliderValue: number[] = [7, 186];
const initialPeriods: DatePeriods[] = [{ start: new Date(), end: new Date() }];
const endSettings: EndSettings = {
    applicationEndDate: new Date(),
    isWithoutApplicationDate: false,
};
const timeSettings: TimeSettingsControls = {
    isApplicableAtTheEnd: false,
    isFullYearAcceptable: false,
};

const defaultValues: DefaultValues<OfferWhenFields> = {
    participationPeriod: initialSliderValue,
    periods: initialPeriods,
    endSettings,
    timeSettings,
};

export const OfferWhenForm = memo(({ onComplete }: OfferWhenFormProps) => {
    const [updateWhen, { isError }] = useUpdateWhenMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { id } = useParams();

    const onSubmit: SubmitHandler<OfferWhenFields> = async (data) => {
        const preparedData = offerWhenFormAdapter(data);
        await updateWhen({ body: { id, ...preparedData } })
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
        onComplete?.();
    };

    const { handleSubmit, control } = useForm<OfferWhenFields>({
        mode: "onChange",
        defaultValues,
    });

    return (
        <form className={styles.form}>
            {isError && toast && (
                <HintPopup text={toast.text} type={toast.type} />
            )}
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
            <Controller
                name="timeSettings"
                control={control}
                render={({ field }) => (
                    <OfferWhenTimeSettings
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
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
            <Controller
                name="endSettings"
                control={control}
                render={({ field }) => (
                    <OfferWhenRequests
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Button
                onClick={handleSubmit(onSubmit)}
                className={styles.btn}
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                Сохранить
            </Button>
        </form>
    );
});
