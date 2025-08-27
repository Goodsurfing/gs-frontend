import {
    memo, useCallback, useEffect, useState,
} from "react";
import {
    Controller, DefaultValues, useForm, useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ErrorType } from "@/types/api/error";

import {
    useGetOfferByIdQuery,
    useUpdateOfferMutation,
} from "@/entities/Offer/api/offerApi";

import { OFFER_WHEN_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import Preloader from "@/shared/ui/Preloader/Preloader";

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
import styles from "./OfferWhenForm.module.scss";
import { getOffersWhoNeedsPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferWhenFormProps {
    onComplete?: () => void;
}

export const OfferWhenForm = memo(({ onComplete }: OfferWhenFormProps) => {
    const { id } = useParams();
    const { locale } = useLocale();

    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const { data: getOfferData, isLoading: isLoadingGetWhenData } = useGetOfferByIdQuery(id || "");
    const [toast, setToast] = useState<ToastAlert>();
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

    const saveFormData = useCallback(
        (data: OfferWhenFields) => {
            sessionStorage.setItem(
                `${OFFER_WHEN_FORM}${id}`,
                JSON.stringify(offerWhenFormApiAdapter(data)),
            );
        },
        [id],
    );

    const loadFormData = useCallback((): OfferWhenFields | null => {
        const savedData = sessionStorage.getItem(`${OFFER_WHEN_FORM}${id}`);
        return savedData ? offerWhenFormAdapter(JSON.parse(savedData)) : null;
    }, [id]);

    const initializeForm = useCallback(() => {
        const savedData = loadFormData();
        if (savedData) {
            reset(savedData);
        } else if (getOfferData?.when) {
            reset(offerWhenFormAdapter(getOfferData?.when));
        } else {
            reset();
        }
    }, [getOfferData?.when, loadFormData, reset]);

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
        const preparedData = offerWhenFormApiAdapter(data);
        setToast(undefined);
        await updateOffer({ id: Number(id), body: { when: preparedData } })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Данные успешно изменены",
                    type: HintType.Success,
                });
                sessionStorage.removeItem(`${OFFER_WHEN_FORM}${id}`);
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
        onComplete?.();
    });

    if (isLoadingGetWhenData) {
        return <Preloader className={styles.loading} />;
    }

    return (
        <form className={styles.form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
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
            <div className={styles.buttons}>
                <Button
                    disabled={isLoading}
                    onClick={onSubmit}
                    className={styles.btn}
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                >
                    {t("when.Сохранить")}
                </Button>
                <ButtonLink
                    path={getOffersWhoNeedsPageUrl(locale, id ?? "")}
                    size="MEDIUM"
                    type="outlined"
                >
                    {t("Дальше")}
                </ButtonLink>
            </div>
        </form>
    );
});
