import {
    memo, useCallback, useEffect,
} from "react";
import {
    Controller,
    DefaultValues,
    useForm,
    useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SkillsForm } from "@/features/SkillsForm";
import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";
import { OfferWhatToDoFormFields } from "../../model/types/offerWhatToDo";
import { WorkingHoursField } from "../WorkingHoursField/WorkingHoursField";
import { offerWhatToDoAdapter, offerWhatToDoApiAdapter } from "../../model/lib/offerWhatToDoAdapter";
import { OFFER_WHAT_TO_DO_FORM } from "@/shared/constants/localstorage";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./OfferWhatToDoForm.module.scss";

interface OfferWhatToDoFormProps {
    offerId: string;
    initialData?: OfferWhatToDoFormFields | null;
    isLoadingGetData: boolean;
    isLoadingUpdateData: boolean;
    onComplete: (data: OfferWhatToDoFormFields) => void;
    linkNext: string;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOff: 2, hours: 6, timeType: "week" },
    extraInfo: "",
};

export const OfferWhatToDoForm = memo(
    (props: OfferWhatToDoFormProps) => {
        const {
            offerId, onComplete, isLoadingGetData,
            isLoadingUpdateData, initialData,
            linkNext,
        } = props;

        const {
            handleSubmit, control, reset, formState: { isDirty },
        } = useForm<OfferWhatToDoFormFields>({
            mode: "onChange",
            defaultValues,
        });
        const watch = useWatch({ control });
        const { t } = useTranslation("offer");

        const saveFormData = useCallback((data: OfferWhatToDoFormFields) => {
            sessionStorage.setItem(`${OFFER_WHAT_TO_DO_FORM}${offerId}`, JSON.stringify(offerWhatToDoApiAdapter(data)));
        }, [offerId]);

        const loadFormData = useCallback((): OfferWhatToDoFormFields | null => {
            const savedData = sessionStorage.getItem(`${OFFER_WHAT_TO_DO_FORM}${offerId}`);
            return savedData ? offerWhatToDoAdapter(JSON.parse(savedData)) : null;
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
                saveFormData(currentData as OfferWhatToDoFormFields);
            }
        }, [isDirty, saveFormData, watch]);

        const onSubmit = handleSubmit((data) => {
            onComplete(data);
        });

        if (isLoadingGetData) {
            return (
                <div className={styles.wrapper}>
                    <MiniLoader />
                </div>
            );
        }

        return (
            <form onSubmit={onSubmit} className={styles.wrapper}>
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
                        disabled={isLoadingUpdateData}
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        type="submit"
                    >
                        {t("whatToDo.Сохранить")}
                    </Button>
                    <ButtonLink
                        path={linkNext}
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
