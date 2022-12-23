import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import { useAppSelector } from "@/hooks/redux";

import { authApi } from "@/store/api/authApi";

import styles from "./ProfileResetPasswordForm.module.scss";

interface IResetPasswordFormFields {
    newPassword: string;
    confirmNewPassword: string;
}

const ProfileResetPasswordForm: FC = () => {
    const { token } = useAppSelector((state) => state.login);

    const { control, handleSubmit } = useForm<IResetPasswordFormFields>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IResetPasswordFormFields> = ({
        newPassword,
        confirmNewPassword,
    }) => {
        if (newPassword && confirmNewPassword && token) {
            if (newPassword === confirmNewPassword) {
                console.log("ok");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Controller
                control={control}
                name={"newPassword"}
                defaultValue={""}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        text={"Новый пароль"}
                        type={"text"}
                    />
                )}
            />
            <Controller
                control={control}
                name={"confirmNewPassword"}
                defaultValue={""}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        text={"Подтвердите пароль"}
                        type={"text"}
                    />
                )}
            />
            <Button type={"submit"} variant={"primary"}>
                Сохранить
            </Button>
        </form>
    );
};

export default ProfileResetPasswordForm;
