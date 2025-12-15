import React, {
    FC, memo, useCallback, useEffect, useState,
} from "react";
import {
    Controller,
    DefaultValues,
    SubmitHandler,
    useForm,
    useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ErrorType } from "@/types/api/error";

import { SkillsForm } from "@/features/SkillsForm";

import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { volunteerSkillsAdapter, volunteerSkillsApiAdapter } from "../../lib/volunteerSkillsAdapter";
import { VolunteerSkillsField } from "../../model/types/volunteerSkills";
import { VolunteerLanguage } from "../VolunteerLanguage/VolunteerLanguage";
import { VOLUNTEER_SKILLS_FORM } from "@/shared/constants/localstorage";
import { Profile, useUpdateVolunteerMutation } from "@/entities/Profile";
import styles from "./VolunteerSkillsForm.module.scss";

interface VolunteerSkillsFormProps {
    profileData: Profile;
}

const defaultValues: DefaultValues<VolunteerSkillsField> = {
    languages: [],
    skills: [],
    additionalSkills: [],
};

export const VolunteerSkillsForm: FC<VolunteerSkillsFormProps> = memo(
    (props: VolunteerSkillsFormProps) => {
        const { profileData } = props;
        const { t } = useTranslation("volunteer");
        const [toast, setToast] = useState<ToastAlert>();

        const [updateVolunteer, { isLoading }] = useUpdateVolunteerMutation();

        const {
            handleSubmit, control, reset, formState: { isDirty },
        } = useForm<VolunteerSkillsField>({
            mode: "onChange",
            defaultValues,
        });
        const watch = useWatch({ control });

        const saveFormData = useCallback((data: VolunteerSkillsField) => {
            sessionStorage.setItem(`${VOLUNTEER_SKILLS_FORM}`, JSON.stringify(volunteerSkillsAdapter(data)));
        }, []);

        const loadFormData = useCallback((): VolunteerSkillsField | null => {
            const savedData = sessionStorage.getItem(`${VOLUNTEER_SKILLS_FORM}`);
            return savedData ? volunteerSkillsApiAdapter(JSON.parse(savedData)) : null;
        }, []);

        const initializeForm = useCallback(() => {
            const savedData = loadFormData();
            if (savedData) {
                reset(savedData);
            } else if (profileData) {
                reset(volunteerSkillsApiAdapter(profileData));
            } else {
                reset();
            }
        }, [loadFormData, reset, profileData]);

        useEffect(() => {
            initializeForm();
        }, [initializeForm]);

        useEffect(() => {
            if (isDirty) {
                const currentData = watch;
                saveFormData(currentData as VolunteerSkillsField);
            }
        }, [isDirty, saveFormData, watch]);

        const onSubmit: SubmitHandler<VolunteerSkillsField> = async (data) => {
            setToast(undefined);
            const formattedData = volunteerSkillsAdapter(data);
            await updateVolunteer(formattedData)
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Данные успешно изменены",
                        type: HintType.Success,
                    });
                    sessionStorage.removeItem(VOLUNTEER_SKILLS_FORM);
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <Controller
                    name="languages"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                        <VolunteerLanguage
                            className={styles.language}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <span className={styles.titleSkills}>
                    {t("volunteer-skills.Навыки которыми вы обладаете")}
                </span>
                <SkillsForm control={control} />
                <Controller
                    name="extraInfo"
                    control={control}
                    rules={{ required: false, maxLength: 1000 }}
                    render={({ field }) => (
                        <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            label={t(
                                "volunteer-skills.Дополнительная информация",
                            )}
                            description={t(
                                "volunteer-skills.Не более 1000 знаков",
                            )}
                        />
                    )}
                />
                <Button type="submit" color="BLUE" size="MEDIUM" variant="FILL" disabled={isLoading}>
                    {t("volunteer-skills.Сохранить")}
                </Button>
            </form>
        );
    },
);
