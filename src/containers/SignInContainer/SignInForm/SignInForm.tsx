import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import i18n from "i18next";
import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Checkbox from "@/components/Checkbox/Checkbox";
import HintPopup from "@/components/HintPopup/HintPopup";
import { HintType } from "@/components/HintPopup/HintPopup.interface";
import InputField from "@/components/InputField/InputField";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { useAppDispatch } from "@/hooks/redux";

import { AppRoutesEnum } from "@/routes/types";

import tokenStorage from "@/utils/storage/TokenStorage";

import { authApi } from "@/store/api/authApi";
import { setLoginUserData } from "@/store/reducers/loginSlice";
import { IToast } from "@/store/reducers/toastSlice";

import { IAuthLoginData } from "@/types/api/auth/login.interface";

import styles from "./SignInForm.module.scss";

const SignInForm: FC = () => {
    const [loginUser, { isError }] = authApi.useLoginUserMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [toast, setToast] = useState<IToast>();

    const [isRemember, setIsRemember] = useState<boolean>(true);
    const { control, reset, handleSubmit } = useForm<IAuthLoginData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthLoginData> = async (data) => {
        loginUser(data)
            .unwrap()
            .then((res) => {
                dispatch(setLoginUserData(res));
                tokenStorage.setToken(res.token);
                navigate(`/${i18n.language}/`);
                reset();
            })
            .catch((err) => {
                console.error("Неверные данные");
                setToast({
                    text: "Неверный логин или пароль",
                    type: HintType.Error,
                });
            });
    };

    const checkboxHandleClick = () => {
        setIsRemember(!isRemember);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {isError && toast && (
                <HintPopup type={HintType.Error} text="Произошла ошибка" />
            )}
            <Controller
                control={control}
                name="username"
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

            <Button type="submit" variant={Variant.SECONDARY}>
                Войти
            </Button>

            <div className={styles.help}>
                <Checkbox
                    isChecked={isRemember}
                    onChange={checkboxHandleClick}
                    text="Запомнить меня"
                />
                <LocaleLink
                    to={AppRoutesEnum.RESET_PASSWORD}
                    className={styles.forget}
                >
                    Забыли пароль?
                </LocaleLink>
            </div>
        </form>
    );
};

export default SignInForm;
