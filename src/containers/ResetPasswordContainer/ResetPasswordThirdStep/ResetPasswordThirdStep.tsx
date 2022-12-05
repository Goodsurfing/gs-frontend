import { IResetPasswordVerifyData } from "@/type/auth/auth.interface";
import React, { FC } from "react";
import { Controller, useForm } from "react-hook-form";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./ResetPasswordThirdStep.module.scss";

interface IFormData {
    password: string;
    confirmPassword: string;
}

const ResetPasswordThirdStep: FC = () => {
    const { control, reset, handleSubmit } = useForm<IFormData>({
        mode: "onChange",
    });

    const onSubmit = async (data: IFormData) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Controller
                control={control}
                name={"password"}
                defaultValue={""}
                render={({ field }) => (
                    <InputField
                        onChange={field.onChange}
                        value={field.value}
                        type={"password"}
                        text={"Новый пароль"}
                    />
                )}
            />
            <Controller
                control={control}
                name={"confirmPassword"}
                defaultValue={""}
                render={({ field }) => (
                    <InputField
                        onChange={field.onChange}
                        value={field.value}
                        type={"password"}
                        text={"Повторите новый пароль"}
                    />
                )}
            />

            <Button type={"submit"} variant={"primary"}>
                Отправить
            </Button>
        </form>
    );
};

export default ResetPasswordThirdStep;
