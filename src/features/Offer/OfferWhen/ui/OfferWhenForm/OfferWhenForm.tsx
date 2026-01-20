import {
    memo, useCallback, useEffect,
} from "react";
import {
    Controller, DefaultValues, useForm, useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OFFER_WHEN_FORM } from "@/shared/constants/localstorage";
import Button from "@/shared/ui/Button/Button";

import {
    offerWhenFormAdapter,
    offerWhenFormApiAdapter,
} from "../../lib/offerWhenFormAdapter";
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
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./OfferWhenForm.module.scss";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";

interface OfferWhenFormProps {
    initialData?: OfferWhenFields | null;
    isLoadingGetWhenData?: boolean;
    isLoadingUpdateWhenData?: boolean;
    offerId: string;
    linkNext: string;
    onComplete?: (data: OfferWhenFields) => void;
}

export const OfferWhenForm = memo((props: OfferWhenFormProps) => {
    const {
        initialData, isLoadingGetWhenData, isLoadingUpdateWhenData, onComplete,
        linkNext, offerId,
    } = props;

    const { t } = useTranslation("offer");

    const initialSliderValue: number[] = [7, 186];
    const initialPeriods: DatePeriods[] = [];
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
        handleSubmit,
        control,
        reset,
        formState: { isDirty },
        setValue,
    } = useForm<OfferWhenFields>({
        mode: "onChange",
        defaultValues,
    });

    const watch = useWatch({ control });
    const {
        timeSettings: watchTimeSettings,
        periods: watchPeriods,
        endSettings: watchEndSettings,
    } = watch;

    const hasSavedDataInSession = useCallback(() => sessionStorage.getItem(`${OFFER_WHEN_FORM}${offerId}`) !== null, [offerId]);

    const saveFormData = useCallback(
        (data: OfferWhenFields) => {
            sessionStorage.setItem(
                `${OFFER_WHEN_FORM}${offerId}`,
                JSON.stringify(offerWhenFormApiAdapter(data)),
            );
        },
        [offerId],
    );

    const loadFormData = useCallback((): OfferWhenFields | null => {
        const savedData = sessionStorage.getItem(`${OFFER_WHEN_FORM}${offerId}`);
        return savedData ? offerWhenFormAdapter(JSON.parse(savedData)) : null;
    }, [offerId]);

    const initializeForm = useCallback(() => {
        const savedData = loadFormData();
        if (savedData) {
            reset(savedData);
        } else if (initialData) {
            reset(initialData);
        } else {
            reset();
        }
    }, [initialData, loadFormData, reset]);

    useEffect(() => {
        initializeForm();
    }, [initializeForm]);

    useEffect(() => {
        if (isDirty) {
            const currentData = watch;
            saveFormData(currentData as OfferWhenFields);
        }
    }, [isDirty, saveFormData, watch]);

    const onSubmit = handleSubmit(async (data) => {
        onComplete?.(data);
    });

    if (isLoadingGetWhenData) {
        return <MiniLoader />;
    }

    return (
        <form className={styles.form}>
            {!watchTimeSettings?.isFullYearAcceptable && (
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
            )}
            <Controller
                name="timeSettings"
                control={control}
                render={({ field }) => (
                    <OfferWhenTimeSettings
                        value={field.value}
                        onChange={field.onChange}
                        periods={watchPeriods as DatePeriods[]}
                        endSettings={watchEndSettings as EndSettings}
                        setValue={setValue}
                    />
                )}
            />
            <Controller
                name="participationPeriod"
                control={control}
                render={({ field }) => (
                    <OfferWhenSlider
                        isMobile
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
                        isApplicableAtTheEnd={
                            watchTimeSettings?.isApplicableAtTheEnd as boolean
                        }
                    />
                )}
            />
            <div className={styles.buttonsWrapper}>
                {hasSavedDataInSession() && (
                    <ErrorText text={t("У вас есть несохраненные изменения")} />
                )}
                <div className={styles.buttons}>
                    <Button
                        disabled={isLoadingUpdateWhenData}
                        onClick={onSubmit}
                        className={styles.btn}
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                    >
                        {t("Сохранить")}
                    </Button>
                    <ButtonLink
                        path={linkNext}
                        size="MEDIUM"
                        type="outlined"
                    >
                        {t("Дальше")}
                    </ButtonLink>
                </div>
            </div>
        </form>
    );
});
