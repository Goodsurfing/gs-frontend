import { memo } from "react";
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

interface ProfileInfoFormProps {
    className?: string;
    profile: Profile;
}

export const ProfileInfoForm = memo((props: ProfileInfoFormProps) => {
    const {
        className,
        profile,
    } = props;
    const { t } = useTranslation("about-me");
    const form = useForm<ProfileInfoFields>({ mode: "onChange", defaultValues: profileInfoFormAdapter(profile) });

    const [updateProfile] = profileApi.useUpdateProfileInfoMutation();

    const { handleSubmit, reset } = form;

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<ProfileInfoFields> = (data) => {
        const formattedData = profileFormApiAdapter(data);
        updateProfile(formattedData);
        dispatch(profileActions.setReadonly(true));
    };

    const isLocked = useAppSelector(getProfileReadonly);

    const onReadonlyChange = () => {
        dispatch(profileActions.setReadonly(!isLocked));
        if (!isLocked) {
            reset(profileInfoFormAdapter(profile));
        }
    };

    return (
        <FormProvider {...form}>
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
                        {t("Сохранить")}
                    </Button>
                </div>
                <button className={styles.stateButton} type="button" onClick={onReadonlyChange}>
                    {isLocked ? t("Редактировать") : t("Отмена")}
                </button>
            </form>
        </FormProvider>
    );
});
