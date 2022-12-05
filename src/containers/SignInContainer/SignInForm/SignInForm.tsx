import { IAuthFormData } from "@/type/auth/auth.interface";
import { taskCancelled } from "@reduxjs/toolkit/dist/listenerMiddleware/exceptions";
import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import Checkbox from "@/components/Checkbox/Checkbox";
import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import { AppRoutesEnum } from "@/routes/types";

import styles from "./SignInForm.module.scss";

const SignInForm: FC = () => {
    const [isRemember, setIsRemember] = useState<boolean>(false);
    const { control, reset, handleSubmit } = useForm<IAuthFormData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthFormData> = (data) => {
        try {
            console.log(data);
            console.log(isRemember);
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
                name={"email"}
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
