import i18n from "i18next";
import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Checkbox from "@/components/Checkbox/Checkbox";
import InputField from "@/components/InputField/InputField";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";

import { useAppDispatch } from "@/hooks/redux";

import { AppRoutesEnum } from "@/routes/types";

import { authApi, reauthApi } from "@/store/api/authApi";
import { setLoginUserData } from "@/store/reducers/loginSlice";

import { IAuthLoginData } from "@/types/api/auth/login.interface";

import styles from "./SignInForm.module.scss";

const SignInForm: FC = () => {
    const [loginUser] = authApi.useLoginUserMutation();
    const [authUser] = reauthApi.useAuthUserMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isRemember, setIsRemember] = useState<boolean>(false);
    const { control, reset, handleSubmit } = useForm<IAuthLoginData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthLoginData> = async (data) => {
        try {
            await authUser(data)
            .unwrap()
            .then((res) => {
                // console.log(res)
                dispatch(setLoginUserData(res));
                if (isRemember) {
                    localStorage.setItem("token", res.token);
                }
                navigate(`/${i18n.language}/`);
                reset();
            })
            // await loginUser(data)
            //     .unwrap()
            //     .then((response) => {
            //         dispatch(setLoginUserData(response));
            //         if (isRemember) {
            //             localStorage.setItem("token", response.token);
            //         }
            //         navigate(`/${i18n.language}/`);
            //         reset();
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
        } catch (e) {
            console.log(e);
        }
    };

    const checkboxHandleClick = () => {
        setIsRemember(!isRemember);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
