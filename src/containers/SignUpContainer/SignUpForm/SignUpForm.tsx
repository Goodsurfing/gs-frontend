import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import InputField from "@/components/InputField/InputField";

import { useAppDispatch } from "@/shared/hooks/redux";

import { getConfirmEmailPageUrl } from "@/shared/config/routes/AppUrls";

import { authApi } from "@/store/api/authApi";
import { setRegisterUserData } from "@/store/reducers/registerSlice";

import { IAuthFormData, IRegisterFormData } from "@/types/api/auth/register.interface";

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
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { control, reset, handleSubmit } = useForm<IAuthFormData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthFormData> = async (data) => {
        const formData: IRegisterFormData = {
            email: data.email,
            plainPassword: data.password,
            locale,
        };
        await registerUser(formData)
            .unwrap()
            .then((response) => {
                dispatch(setRegisterUserData(response));
                navigate(getConfirmEmailPageUrl(locale));
            })
            .catch((e: any) => {
                const textError = (e.status === 422) ? t("login.Данный пользователь уже существует") : t("login.Некорректно введены данные");
                setToast({
                    text: textError,
                    type: HintType.Error,
                });
            });
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
