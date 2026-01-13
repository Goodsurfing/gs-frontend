import {
    memo, useCallback, useEffect,
} from "react";
import {
    Controller, DefaultValues, useForm, useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

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
import { getOffersWhoNeedsPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./OfferWhenForm.module.scss";

interface OfferWhenFormProps {
    initialData?: OfferWhenFields | null;
    isLoadingGetWhenData?: boolean;
    isLoadingUpdateWhenData?: boolean;
    onComplete?: (data: OfferWhenFields) => void;
}

export const OfferWhenForm = memo((props: OfferWhenFormProps) => {
    const {
        initialData, isLoadingGetWhenData, isLoadingUpdateWhenData, onComplete,
    } = props;

    const { id } = useParams();
    const { locale } = useLocale();
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
            <div className={styles.buttons}>
                <Button
                    disabled={isLoadingUpdateWhenData}
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
