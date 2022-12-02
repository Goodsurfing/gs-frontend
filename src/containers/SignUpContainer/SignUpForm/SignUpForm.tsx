import { IAuthFormData } from "@/type/auth/auth.interface";
import React, { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./SignUpForm.module.scss";

const SignUpForm: FC = () => {
    const { control, reset, handleSubmit } = useForm<IAuthFormData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthFormData> = (data) => {
        console.log("reg data:", data);
        reset();
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
            <Button type={"submit"} variant={"primary"} className={styles.btn}>
                Зарегистрироваться
            </Button>
        </form>
    );
};

export default SignUpForm;
