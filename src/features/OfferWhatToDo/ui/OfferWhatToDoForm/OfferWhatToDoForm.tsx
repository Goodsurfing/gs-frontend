import {
    memo, useCallback, useEffect, useState,
} from "react";
import {
    Controller,
    DefaultValues,
    useForm,
    useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import { SkillsForm } from "@/features/SkillsForm";

import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { OfferWhatToDoFormFields } from "../../model/types/offerWhatToDo";
import { WorkingHoursField } from "../WorkingHoursField/WorkingHoursField";
import { offerWhatToDoAdapter, offerWhatToDoApiAdapter } from "../../model/lib/offerWhatToDoAdapter";
import { useGetOfferByIdQuery, useUpdateOfferWhatToDoMutation } from "@/entities/Offer/api/offerApi";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import styles from "./OfferWhatToDoForm.module.scss";
import { OFFER_WHAT_TO_DO_FORM } from "@/shared/constants/localstorage";
import { getOffersConditionsPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOff: 2, hours: 6, timeType: "week" },
    extraInfo: "",
};

export const OfferWhatToDoForm = memo(
    ({ onSuccess }: OfferWhatToDoFormProps) => {
        const {
            handleSubmit, control, reset, formState: { isDirty },
        } = useForm<OfferWhatToDoFormFields>({
            mode: "onChange",
            defaultValues,
        });
        const { id } = useParams();
        const { locale } = useLocale();

        const [updateOfferWhatToDo, { isLoading }] = useUpdateOfferWhatToDoMutation();
        const { data: getOfferData, isLoading: isOfferDataLoading } = useGetOfferByIdQuery(id || "");
        const [toast, setToast] = useState<ToastAlert>();
        const watch = useWatch({ control });

        const { t } = useTranslation("offer");

        const saveFormData = useCallback((data: OfferWhatToDoFormFields) => {
            sessionStorage.setItem(`${OFFER_WHAT_TO_DO_FORM}${id}`, JSON.stringify(offerWhatToDoApiAdapter(data)));
        }, [id]);

        const loadFormData = useCallback((): OfferWhatToDoFormFields | null => {
            const savedData = sessionStorage.getItem(`${OFFER_WHAT_TO_DO_FORM}${id}`);
            return savedData ? offerWhatToDoAdapter(JSON.parse(savedData)) : null;
        }, [id]);

        const initializeForm = useCallback(() => {
            const savedData = loadFormData();
            if (savedData) {
                reset(savedData);
            } else if (getOfferData?.whatToDo) {
                reset(offerWhatToDoAdapter(getOfferData?.whatToDo));
            } else {
                reset();
            }
        }, [getOfferData?.whatToDo, loadFormData, reset]);

        useEffect(() => {
            initializeForm();
        }, [initializeForm]);

        useEffect(() => {
            if (isDirty) {
                const currentData = watch;
                saveFormData(currentData as OfferWhatToDoFormFields);
            }
        }, [isDirty, saveFormData, watch]);

        const onSubmit = handleSubmit(async (data) => {
            const preparedData = offerWhatToDoApiAdapter(data);
            setToast(undefined);
            await updateOfferWhatToDo({ offerId: Number(id), body: preparedData })
                .unwrap()
                .then(() => {
                    setToast({
                        text: t("Данные успешно изменены"),
                        type: HintType.Success,
                    });
                    sessionStorage.removeItem(`${OFFER_WHAT_TO_DO_FORM}${id}`);
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
            onSuccess?.();
        });

        if (isOfferDataLoading) {
            return (
                <div className={styles.wrapper}>
                    <MiniLoader />
                </div>
            );
        }

        return (
            <form onSubmit={onSubmit} className={styles.wrapper}>
                {toast && (
                    <HintPopup text={toast.text} type={toast.type} />
                )}
                <p className={styles.skillsText}>
                    {t("whatToDo.Навыки, которыми должен обладать волонтёр")}
                </p>
                <SkillsForm control={control} />
                <Controller
                    name="workingHours"
                    control={control}
                    render={({ field }) => (
                        <WorkingHoursField
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name="extraInfo"
                    control={control}
                    rules={{ required: false, maxLength: 1000 }}
                    render={({ field }) => (
                        <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            label={t("whatToDo.Дополнительная информация")}
                            description={t("whatToDo.Не более 1000 знаков")}
                        />
                    )}
                />
                <div className={styles.buttons}>
                    <Button
                        onClick={onSubmit}
                        disabled={isLoading}
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        type="submit"
                    >
                        {t("whatToDo.Сохранить")}
                    </Button>
                    <ButtonLink
                        path={getOffersConditionsPageUrl(locale, id ?? "")}
                        size="MEDIUM"
                        type="outlined"
                    >
                        {t("Дальше")}
                    </ButtonLink>
                </div>
            </form>
        );
    },
);
