import {
    memo, useState,
} from "react";
import {
    Controller, DefaultValues, useForm, useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    DatePeriods, EndSettings, OfferWhenFields, OfferWhenPeriods, OfferWhenRequests,
    OfferWhenSlider, OfferWhenTimeSettings, TimeSettingsControls,
} from "@/features/Offer";
import styles from "./AdminOfferWhenForm.module.scss";
import { getAdminVacancyWhoNeedsPageUrl } from "@/shared/config/routes/AppUrls";

interface AdminOfferWhenFormProps {
    onComplete?: () => void;
}

export const AdminOfferWhenForm = memo(({ onComplete }: AdminOfferWhenFormProps) => {
    const { id } = useParams();
    const { locale } = useLocale();

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

    const onSubmit = handleSubmit(async () => {
        setToast(undefined);
        onComplete?.();
    });

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
                    onClick={onSubmit}
                    className={styles.btn}
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                >
                    {t("when.Сохранить")}
                </Button>
                <ButtonLink
                    path={getAdminVacancyWhoNeedsPageUrl(locale, id ?? "")}
                    size="MEDIUM"
                    type="outlined"
                >
                    {t("Дальше")}
                </ButtonLink>
            </div>
        </form>
    );
});
