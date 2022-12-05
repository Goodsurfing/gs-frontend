import { IAuthLoginData } from "@/type/auth/auth.interface";
import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import Checkbox from "@/components/Checkbox/Checkbox";
import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import { useAppDispatch } from "@/hooks/redux";

import { AppRoutesEnum } from "@/routes/types";

import { authApi } from "@/store/api/authApi";
import { loginSlice, setLoginUserData } from "@/store/reducers/loginSlice";

import styles from "./SignInForm.module.scss";

const SignInForm: FC = () => {
    const [loginUser] = authApi.useLoginUserMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isRemember, setIsRemember] = useState<boolean>(false);
    const { control, reset, handleSubmit } = useForm<IAuthLoginData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthLoginData> = async (data) => {
        try {
            await loginUser(data)
                .unwrap()
                .then((response) => {
                    dispatch(setLoginUserData(response));
                    if (isRemember) {
                        localStorage.setItem("token", response.token);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
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
                name={"username"}
                defaultValue={""}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        type={"email"}
                        text={"E-mail"}
                    />
                )}
            />

            <Controller
                control={control}
                name={"password"}
                defaultValue={""}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        type={"password"}
                        text={"Пароль"}
                    />
                )}
            />

            <Button type={"submit"} variant={"primary"}>
                Войти
            </Button>

            <div className={styles.help}>
                <Checkbox
                    isChecked={isRemember}
                    onChange={checkboxHandleClick}
                    text={"Запомнить меня"}
                />
                <Link to={AppRoutesEnum.RESET} className={styles.forget}>
                    Забыли пароль?
                </Link>
            </div>
        </form>
    );
};

export default SignInForm;
