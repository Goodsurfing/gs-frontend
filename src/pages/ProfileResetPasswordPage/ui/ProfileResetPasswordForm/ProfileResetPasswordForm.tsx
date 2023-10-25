import React, { FC } from "react";
import {
    useForm, Controller, useWatch, SubmitHandler,
} from "react-hook-form";
import Button from "@/shared/ui/Button/Button";

import { authApi } from "@/store/api/authApi";
import { userInfoApi } from "@/store/api/userInfoApi";

import styles from "./ProfileResetPasswordForm.module.scss";
import { IResetPasswordRequestFormData } from "@/types/api/auth/resetPassword.interface";

const ProfileResetPasswordForm: FC = () => {
    const [resetPasswordRequest, { isSuccess }] = authApi.useResetPasswordRequestMutation();
    const { data: userInfo, isSuccess: userInfoSuccess } = userInfoApi.useGetUserInfoQuery();

    const { handleSubmit, control } = useForm();

    const newPassword = useWatch({
        control,
        name: "newPassword",
        defaultValue: "",
    });

    const onSubmit: SubmitHandler<IResetPasswordRequestFormData> = async ({}) => {
        if (userInfoSuccess && userInfo) {
            await resetPasswordRequest({ email: userInfo.email });
        }
    };

    if (isSuccess) {
        return <h1>Заявка на восстановления пароля отправлена на почту!</h1>;
    }

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="currentPassword"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Текущий пароль обязателен" }}
                    render={({ field, fieldState }) => (
                        <div>
                            <label>Текущий пароль</label>
                            <input type="password" {...field} />
                            {fieldState.error && <p>{fieldState.error.message}</p>}
                        </div>
                    )}
                />
                <Controller
                    name="newPassword"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Новый пароль обязателен" }}
                    render={({ field, fieldState }) => (
                        <div>
                            <label>Новый пароль</label>
                            <input type="password" {...field} />
                            {fieldState.error && <p>{fieldState.error.message}</p>}
                        </div>
                    )}
                />
                <Controller
                    name="repeatNewPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                        validate: (value) => value === newPassword || "Пароли должны совпадать",
                        required: "Повторите новый пароль",
                    }}
                    render={({ field, fieldState }) => (
                        <div>
                            <label>Повторите новый пароль</label>
                            <input type="password" {...field} />
                            {fieldState.error && <p>{fieldState.error.message}</p>}
                        </div>
                    )}
                />
                <Button
                    type="submit"
                    color="BLUE"
                    variant="FILL"
                    size="MEDIUM"
                >
                    Сохранить
                </Button>
            </form>

        </div>
    );
};

export default ProfileResetPasswordForm;
