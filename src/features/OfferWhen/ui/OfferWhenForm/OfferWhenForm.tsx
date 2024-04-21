import { memo, useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    SubmitHandler,
    useForm,
    useWatch,
} from "react-hook-form";
import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useGetWhenQuery, useUpdateWhenMutation } from "@/entities/Offer/api/offerApi";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { offerWhenFormAdapter, offerWhenFormApiAdapter } from "../../lib/offerWhenFormAdapter";
import type {
    DatePeriods,
    EndSettings,
    OfferWhenFields,
    TimeSettingsControls,
} from "../../model/types/offerWhen";
import { OfferWhenPeriods } from "../OfferWhenPeriods/OfferWhenPeriods";
import { OfferWhenRequests } from "../OfferWhenRequests/OfferWhenRequests";
import { OfferWhenSlider } from "../OfferWhenSlider/OfferWhenSlider";
import { OfferWhenTimeSettings } from "../OfferWhenTimeSettings/OfferWhenTimeSettings";
import styles from "./OfferWhenForm.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";

interface OfferWhenFormProps {
    onComplete?: () => void;
}

export const OfferWhenForm = memo(({ onComplete }: OfferWhenFormProps) => {
    const { id } = useParams();
    const [updateWhen, { isLoading }] = useUpdateWhenMutation();
    const { data: getWhenData, isLoading: isLoadingGetWhenData } = useGetWhenQuery({ id: id || "" });
    const [toast, setToast] = useState<ToastAlert>();
    const { t } = useTranslation("offer");

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
    const {
        handleSubmit, control, reset,
    } = useForm<OfferWhenFields>({
        mode: "onChange",
        defaultValues,
    });

    const watchIsFullYearAcceptable = useWatch({ name: "timeSettings.isFullYearAcceptable", control });

    const onSubmit: SubmitHandler<OfferWhenFields> = async (data) => {
        const preparedData = offerWhenFormApiAdapter(data);
        setToast(undefined);
        updateWhen({ body: { id, when: preparedData } })
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

    useEffect(() => {
        if (getWhenData) {
            reset(offerWhenFormAdapter(getWhenData));
        }
    }, [getWhenData, reset]);

    if (isLoadingGetWhenData) {
        return <Preloader className={styles.loading} />;
    }

    return (
        <form className={styles.form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {
                !watchIsFullYearAcceptable && (
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
                )
            }
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
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
                className={styles.btn}
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                {t("when.Сохранить")}
            </Button>
        </form>
    );
});
