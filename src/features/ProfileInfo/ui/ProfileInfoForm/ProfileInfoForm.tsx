import { memo, useEffect, useState } from "react";
import cn from "classnames";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import Button from "@/shared/ui/Button/Button";

import {
    Profile, getProfileReadonly, profileActions, profileApi,
} from "@/entities/Profile";

import { ProfileInfoFormContent } from "../ProfileInfoFormContent/ProfileInfoFormContent";
import type { ProfileInfoFields } from "../../model/types/profileInfo";
import { profileInfoFormAdapter } from "../../lib/profileInfoFormAdapter";
import { profileFormApiAdapter } from "../../lib/profileFormApiAdapter";

import styles from "./ProfileInfoForm.module.scss";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { ToastAlert, HintType } from "@/shared/ui/HintPopup/HintPopup.interface";

interface ProfileInfoFormProps {
    className?: string;
    profile: Profile;
}

export const ProfileInfoForm = memo((props: ProfileInfoFormProps) => {
    const {
        className,
        profile,
    } = props;
    const { t } = useTranslation("profile");
    const form = useForm<ProfileInfoFields>({ mode: "onChange", defaultValues: profileInfoFormAdapter(profile) });
    const [toast, setToast] = useState<ToastAlert>();

    const [updateProfile] = profileApi.useUpdateProfileInfoMutation();
    const { data: getProfileData } = profileApi.useGetProfileInfoQuery();

    const { handleSubmit, reset } = form;

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<ProfileInfoFields> = (data) => {
        const formattedData = profileFormApiAdapter(data);
        updateProfile(formattedData).unwrap().then(() => {
            setToast({
                text: "Данные успешно изменены",
                type: HintType.Success,
            });
        }).catch(() => {
            setToast({
                text: "Некорректно введены данные",
                type: HintType.Error,
            });
        });
        dispatch(profileActions.setReadonly(true));
    };

    useEffect(() => {
        if (getProfileData) {
            reset(profileInfoFormAdapter(getProfileData));
        }
    }, [getProfileData, reset]);

    const isLocked = useAppSelector(getProfileReadonly);

    const onReadonlyChange = () => {
        dispatch(profileActions.setReadonly(!isLocked));
        if (!isLocked) {
            reset(profileInfoFormAdapter(profile));
        } else {
            reset();
        }
    };

    return (
        <FormProvider {...form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={cn(styles.wrapper, className)}
            >
                <ProfileInfoFormContent />
                <div className={styles.submitBtn}>
                    <Button
                        disabled={isLocked}
                        type="submit"
                        variant="FILL"
                        size="MEDIUM"
                        color="BLUE"
                    >
                        {t("info.Сохранить")}
                    </Button>
                </div>
                <button className={styles.stateButton} type="button" onClick={onReadonlyChange}>
                    {isLocked ? t("info.Редактировать") : t("info.Отмена")}
                </button>
            </form>
        </FormProvider>
    );
});
