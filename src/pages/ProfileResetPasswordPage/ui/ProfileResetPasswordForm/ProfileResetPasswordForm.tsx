import React, {
    FC, useCallback, useState,
} from "react";
import {
    Controller, SubmitHandler, useForm, useWatch,
} from "react-hook-form";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import Input from "@/shared/ui/Input/Input";
import { useChangePasswordMutation, useChangePasswordWithoutOldPasswordMutation, useGetProfilePasswordIsChangeQuery } from "@/entities/Profile";

import styles from "./ProfileResetPasswordForm.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface FormDataImplemintaion {
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
}

interface ToastState {
    text: string;
    type: HintType;
}

const ProfileResetPasswordForm: FC = () => {
    const [toast, setToast] = useState<ToastState>();
    const { t } = useTranslation("profile");

    const { handleSubmit, control, reset } = useForm<FormDataImplemintaion>();

    const [resetPasswordVerify] = useChangePasswordMutation();
    const [changePasswordWithoutOldPassword] = useChangePasswordWithoutOldPasswordMutation();
    const {
        data: passwordIsChange,
        isLoading: isLoadingCheck,
    } = useGetProfilePasswordIsChangeQuery();

    const newPassword = useWatch({
        control,
        name: "newPassword",
        defaultValue: "",
    });

    const shouldShowCurrentPassword = passwordIsChange?.isChangePassword === true;

    const onSubmit: SubmitHandler<FormDataImplemintaion> = useCallback(
        async (data) => {
            setToast(undefined);

            try {
                if (shouldShowCurrentPassword) {
                    await resetPasswordVerify({
                        oldPassword: data.currentPassword,
                        plainPassword: data.newPassword,
                    }).unwrap();
                } else {
                    await changePasswordWithoutOldPassword({
                        password: data.newPassword,
                    }).unwrap();
                }

                setToast({
                    text: t("password.Изменение пароля произошло успешно"),
                    type: HintType.Success,
                });
                reset();
            } catch (error) {
                setToast({
                    text: t("password.Произошла ошибка"),
                    type: HintType.Error,
                });
            }
        },
        [shouldShowCurrentPassword, resetPasswordVerify,
            changePasswordWithoutOldPassword, t, reset],
    );

    if (isLoadingCheck) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.loading}><MiniLoader /></div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <form
                className={styles.inputContainer}
                onSubmit={handleSubmit(onSubmit)}
            >
                {toast && (
                    <HintPopup type={toast.type} text={toast.text} />
                )}
                {shouldShowCurrentPassword && (
                    <Controller
                        name="currentPassword"
                        control={control}
                        rules={{ required: t("password.Текущий пароль обязателен") }}
                        render={({ field, fieldState }) => (
                            <div className={styles.inputWrapper}>
                                <label>{t("password.Текущий пароль")}</label>
                                <Input type="password" {...field} />
                                {fieldState.error && (
                                    <p className={styles.inputError}>
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                )}

                <Controller
                    name="newPassword"
                    control={control}
                    rules={{ required: t("password.Новый пароль обязателен") }}
                    render={({ field, fieldState }) => (
                        <div className={styles.inputWrapper}>
                            <label>{t("password.Новый пароль")}</label>
                            <Input type="password" {...field} />
                            {fieldState.error && (
                                <p className={styles.inputError}>
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="repeatNewPassword"
                    control={control}
                    rules={{
                        validate: (value) => value === newPassword || t("password.Пароли должны совпадать"),
                        required: t("password.Повторите новый пароль"),
                    }}
                    render={({ field, fieldState }) => (
                        <div className={styles.inputWrapper}>
                            <label>{t("password.Повторите новый пароль")}</label>
                            <Input type="password" {...field} />
                            {fieldState.error && (
                                <p className={styles.inputError}>
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />
                <Button
                    type="submit"
                    color="BLUE"
                    variant="FILL"
                    size="MEDIUM"
                    className={styles.button}
                >
                    {t("password.Сохранить")}
                </Button>
            </form>
        </div>
    );
};

export default ProfileResetPasswordForm;
