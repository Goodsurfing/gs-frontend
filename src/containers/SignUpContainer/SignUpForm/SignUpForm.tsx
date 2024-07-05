import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/ui/Button/Button";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import InputField from "@/components/InputField/InputField";

import { useAppDispatch } from "@/shared/hooks/redux";

import { getConfirmEmailPageUrl } from "@/shared/config/routes/AppUrls";

import { authApi } from "@/store/api/authApi";
import { setRegisterUserData } from "@/store/reducers/registerSlice";

import { IAuthFormData } from "@/types/api/auth/register.interface";

import styles from "./SignUpForm.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface ToastAlert {
    text: string;
    type: HintType
}

const SignUpForm: FC = () => {
    const [registerUser, { isError }] = authApi.useRegisterUserMutation();

    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { control, reset, handleSubmit } = useForm<IAuthFormData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthFormData> = async (data) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("plainPassword", data.password);
        formData.append("locale", locale);
        try {
            await registerUser(formData)
                .unwrap()
                .then((response) => {
                    dispatch(setRegisterUserData(response));
                    navigate(getConfirmEmailPageUrl(locale));
                })
                .catch(() => {
                    setToast({
                        text: "Некорректно введены данные",
                        type: HintType.Error,
                    });
                });
        } catch (e) {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {isError && toast && (
                <HintPopup text={toast.text} type={toast.type} />
            )}
            <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        type="email"
                        text="E-mail"
                    />
                )}
            />
            <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        type="password"
                        text="Пароль"
                    />
                )}
            />
            <Button
                type="submit"
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
                className={styles.btn}
            >
                Зарегистрироваться
            </Button>
        </form>
    );
};

export default SignUpForm;
