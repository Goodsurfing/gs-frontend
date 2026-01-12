import {
    memo, useState,
} from "react";
import {
    Controller,
    DefaultValues,
    useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import { SkillsForm } from "@/features/SkillsForm";

import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getAdminVacancyConditionsPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferWhatToDoFormFields, WorkingHoursField } from "@/features/OfferWhatToDo";
import styles from "./OfferWhatToDoForm.module.scss";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOff: 2, hours: 6, timeType: "week" },
    extraInfo: "",
};

export const AdminOfferWhatToDoForm = memo(
    ({ onSuccess }: OfferWhatToDoFormProps) => {
        const {
            handleSubmit, control,
        } = useForm<OfferWhatToDoFormFields>({
            mode: "onChange",
            defaultValues,
        });
        const { id } = useParams();
        const { locale } = useLocale();

        const [toast, setToast] = useState<ToastAlert>();

        const { t } = useTranslation("offer");

        const onSubmit = handleSubmit(async () => {
            setToast(undefined);
            onSuccess?.();
        });

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
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        type="submit"
                    >
                        {t("whatToDo.Сохранить")}
                    </Button>
                    <ButtonLink
                        path={getAdminVacancyConditionsPageUrl(locale, id ?? "")}
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
