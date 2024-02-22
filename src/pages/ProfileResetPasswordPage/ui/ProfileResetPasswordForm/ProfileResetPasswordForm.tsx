import React, {
    FC, useCallback, useState,
} from "react";
import {
    Controller, SubmitHandler, useForm, useWatch,
} from "react-hook-form";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { authApi } from "@/store/api/authApi";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import Input from "@/shared/ui/Input/Input";

import styles from "./ProfileResetPasswordForm.module.scss";

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
    const [resetPasswordVerify, { isSuccess, isError }] = authApi.useResetPasswordVerifyMutation();
    const [toast, setToast] = useState<ToastState>();
    const { token } = useAuth();

    const { handleSubmit, control, reset } = useForm<FormDataImplemintaion>();

    const newPassword = useWatch({
        control,
        name: "newPassword",
        defaultValue: "",
    });

    const onSubmit: SubmitHandler<FormDataImplemintaion> = useCallback(
        async ({ newPassword: plainPassword }) => {
            if (!token) {
                setToast({
                    text: "Произошла ошибка",
                    type: HintType.Error,
                });
                return;
            }
            await resetPasswordVerify({ token, plainPassword })
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Изменение пароля произошло успешно",
                        type: HintType.Error,
                    });
                    reset();
                })
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка",
                        type: HintType.Error,
                    });
                });
        },
        [resetPasswordVerify, reset, token],
    );

    return (
        <div className={styles.wrapper}>
            <form
                className={styles.inputContainer}
                onSubmit={handleSubmit(onSubmit)}
            >
                {isError && toast && (
                    <HintPopup type={HintType.Error} text="Произошла ошибка" />
                )}
                {isSuccess && (
                    <HintPopup
                        type={HintType.Success}
                        text="Изменение пароля произошло успешно"
                    />
                )}
                <Controller
                    name="currentPassword"
                    control={control}
                    rules={{ required: "Текущий пароль обязателен" }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <div className={styles.inputWrapper}>
                            <label>Текущий пароль</label>
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
                    name="newPassword"
                    control={control}
                    rules={{ required: "Новый пароль обязателен" }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <div className={styles.inputWrapper}>
                            <label>Новый пароль</label>
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
                        validate: (value) => value === newPassword || "Пароли должны совпадать",
                        required: "Повторите новый пароль",
                    }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <div className={styles.inputWrapper}>
                            <label>Повторите новый пароль</label>
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
                    Сохранить
                </Button>
            </form>
        </div>
    );
};

export default ProfileResetPasswordForm;
