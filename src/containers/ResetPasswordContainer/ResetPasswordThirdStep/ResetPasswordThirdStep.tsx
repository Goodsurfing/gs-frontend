import React, { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import useQuery from "@/hooks/useQuery";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./ResetPasswordThirdStep.module.scss";

interface IFormData {
    password: string;
    confirmPassword: string;
}

const ResetPasswordThirdStep: FC = () => {
    const navigate = useNavigate();
    const query = useQuery();

    const { control, reset, handleSubmit } = useForm<IFormData>({
        mode: "onChange",
    });

    useEffect(() => {
        if (!query.get("token")) {
            navigate(AppRoutesEnum.HOME);
        }
    }, []);

    const onSubmit = async (data: IFormData) => {
        const token = query.get("token");
        console.log(token, data);
        reset();
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
