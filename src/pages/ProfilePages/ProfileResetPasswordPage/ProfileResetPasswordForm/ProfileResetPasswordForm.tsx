import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./ProfileResetPasswordForm.module.scss";

const ProfileResetPasswordForm: FC = () => {
    const { control, handleSubmit } = useForm({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<any> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Controller
                control={control}
                name={"oldPassword"}
                defaultValue={""}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        text={"Старый пароль"}
                        type={"text"}
                    />
                )}
            />
            <Controller
                control={control}
                name={"newPassword"}
                defaultValue={""}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        text={"Новый пароль"}
                        type={"text"}
                    />
                )}
            />
            <Button type={"submit"} variant={"primary"}>
                Сохранить
            </Button>
        </form>
    );
};

export default ProfileResetPasswordForm;
