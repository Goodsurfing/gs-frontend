import { IResetPasswordRequestFormData } from "@/type/auth/auth.interface";
import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./ResetPasswordFirstStep.module.scss";

const ResetPasswordFirstStep: FC = () => {
    const { control, reset, handleSubmit } =
        useForm<IResetPasswordRequestFormData>({
            mode: "onChange",
        });

    const onSubmit: SubmitHandler<IResetPasswordRequestFormData> = async (
        data
    ) => {
        console.log(data);
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
            <Button type={"submit"} variant={"primary"}>
                Отправить
            </Button>
        </form>
    );
};

export default ResetPasswordFirstStep;
