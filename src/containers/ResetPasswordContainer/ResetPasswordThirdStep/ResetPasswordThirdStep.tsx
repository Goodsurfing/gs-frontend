import i18n from "i18next";
import React, { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Variant } from "@/shared/ui/Button/Button.interface";
import Button from "@/shared/ui/Button/Button";

import InputField from "@/components/InputField/InputField";

import useQuery from "@/shared/hooks/useQuery";

import { RoutePath } from "@/routes/config/RouterConfig";

import { authApi } from "@/store/api/authApi";

import styles from "./ResetPasswordThirdStep.module.scss";

interface IFormData {
    password: string;
    confirmPassword: string;
}

const ResetPasswordThirdStep: FC = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const [resetPasswordVerify] = authApi.useResetPasswordVerifyMutation();

    const { control, reset, handleSubmit } = useForm<IFormData>({
        mode: "onChange",
    });

    useEffect(() => {
        if (!query.get("token")) {
            navigate(`/${i18n.language}/${RoutePath.main}`);
        }
    }, [navigate, query]);

    const onSubmit = async (data: IFormData) => {
        const token = query.get("token");
        if (!token) {
            return;
        }
        if (data.password !== data.confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }
        await resetPasswordVerify({
            token,
            plainPassword: data.password,
        })
            .unwrap()
            .then(() => {
                navigate(`/${i18n.language}/${RoutePath.main}`);
                reset();
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({ field }) => (
                    <InputField
                        onChange={field.onChange}
                        value={field.value}
                        type="password"
                        text="Новый пароль"
                    />
                )}
            />
            <Controller
                control={control}
                name="confirmPassword"
                defaultValue=""
                render={({ field }) => (
                    <InputField
                        onChange={field.onChange}
                        value={field.value}
                        type="password"
                        text="Повторите новый пароль"
                    />
                )}
            />

            <Button type="submit" variant={Variant.PRIMARY}>
                Отправить
            </Button>
        </form>
    );
};

export default ResetPasswordThirdStep;
