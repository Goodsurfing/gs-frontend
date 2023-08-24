import { memo, useEffect } from "react";
import cn from "classnames";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import type { Profile } from "@/entities/Profile";

import Button from "@/shared/ui/Button/Button";

import { ProfileInfoFormContent } from "../ProfileInfoFormContent/ProfileInfoFormContent";
import type { ProfileInfoFields } from "../../model/types/profileInfo";
import { profileInfoFormAdapter } from "../../lib/profileInfoFormAdapter";

import styles from "./ProfileInfoForm.module.scss";

interface ProfileInfoFormProps {
    className?: string;
    profileInfo?: Profile;
    onSuccess?: (data: ProfileInfoFields) => void;
    error?: string;
    isLoading?: boolean;
}

export const ProfileInfoForm = memo((props: ProfileInfoFormProps) => {
    const {
        className,
        onSuccess,
        profileInfo,
        error,
        isLoading,
    } = props;

    const form = useForm<ProfileInfoFields>({ mode: "onChange" });

    const { handleSubmit, reset } = form;

    const onSubmit: SubmitHandler<ProfileInfoFields> = (data) => {
        onSuccess?.(data);
    };

    useEffect(() => {
        reset(profileInfoFormAdapter(profileInfo));
    }, [profileInfo, reset]);

    if (isLoading) {
        return (
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={cn(styles.wrapper, className)}
                >
                    Загрузка...
                </form>
            </FormProvider>
        );
    }

    if (error) {
        return (
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={cn(styles.wrapper, className)}
                >
                    Произошла ошибка! Попробуйте перезагрузить страницу.
                </form>
            </FormProvider>
        );
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={cn(styles.wrapper, className)}
            >
                <ProfileInfoFormContent />
                <Button
                    type="submit"
                    variant="FILL"
                    size="MEDIUM"
                    color="BLUE"
                >
                    Сохранить
                </Button>
            </form>
        </FormProvider>
    );
});
