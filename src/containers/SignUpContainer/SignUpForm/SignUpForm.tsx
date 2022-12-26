import i18n from "i18next";
import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IAuthFormData } from "@/types/api/auth/register.interface";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import { useAppDispatch } from "@/hooks/redux";

import { AppRoutesEnum } from "@/routes/types";

import { authApi } from "@/store/api/authApi";
import { setRegisterUserData } from "@/store/reducers/registerSlice";

import styles from "./SignUpForm.module.scss";

const SignUpForm: FC = () => {
    const [registerUser] = authApi.useRegisterUserMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { control, reset, handleSubmit } = useForm<IAuthFormData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthFormData> = async (data) => {
        try {
            await registerUser({ ...data, locale: "ru" })
                .unwrap()
                .then((response) => {
                    dispatch(setRegisterUserData(response));
                    navigate(
                        `/${i18n.language}/${AppRoutesEnum.CONFIRM_EMAIL}`,
                        { replace: true },
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (e) {
            console.log(e);
        }
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field }) => {
                    return (
                        <InputField
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            type="email"
                            text="E-mail"
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({ field }) => {
                    return (
                        <InputField
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            type="password"
                            text="Пароль"
                        />
                    );
                }}
            />
            <Button type="submit" variant="primary" className={styles.btn}>
                Зарегистрироваться
            </Button>
        </form>
    );
};

export default SignUpForm;
