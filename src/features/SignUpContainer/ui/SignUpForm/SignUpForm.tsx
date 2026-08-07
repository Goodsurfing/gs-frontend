import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import AuthInputField from "@/shared/ui/AuthInputField/AuthInputField";
import LocaleLink from "@/shared/ui/LocaleLink/LocaleLink";

import { useAppDispatch } from "@/shared/hooks/redux";

import { getConfirmEmailPageUrl, getResetPasswordPageUrl, getSignInPageUrl } from "@/shared/config/routes/AppUrls";

import { authApi } from "@/store/api/authApi";
import { setRegisterUserData } from "@/store/reducers/registerSlice";

import { IAuthFormData, IRegisterFormData } from "@/types/api/auth/register.interface";

import styles from "./SignUpForm.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const SignUpForm: FC = () => {
    const [registerUser, { isError }] = authApi.useRegisterUserMutation();

    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
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
            isActive: true,
        };
        await registerUser(formData)
            .unwrap()
            .then((response) => {
                dispatch(setRegisterUserData(response));
                navigate(getConfirmEmailPageUrl(locale));
            })
            .catch((e: any) => {
                const isDuplicate = e.status === 422;
                const textError = isDuplicate ? t("login.Данный пользователь уже существует") : t("login.Некорректно введены данные");
                setIsDuplicateEmail(isDuplicate);
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
            {isError && isDuplicateEmail && (
                <div className={styles.duplicateEmailHint}>
                    {t("login.Возможно, вы уже регистрировались.")}
                    {" "}
                    <LocaleLink to={getSignInPageUrl(locale)}>
                        {t("login.Войти")}
                    </LocaleLink>
                    {" "}
                    /
                    {" "}
                    <LocaleLink to={getResetPasswordPageUrl(locale)}>
                        {t("login.Забыли пароль?")}
                    </LocaleLink>
                </div>
            )}
            <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field }) => (
                    <AuthInputField
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
                rules={{
                    required: t("login.ПолеОбязательно"),
                    pattern: {
                        value: /^(?=.*\d).{6,}$/,
                        message: t("login.НедостаточноСложныйПароль"),
                    },
                }}
                render={({ field, fieldState }) => (
                    <AuthInputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        type="password"
                        text={t("login.Пароль")}
                        error={fieldState.error?.message}
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
                {t("login.Зарегистрироваться")}
            </Button>
        </form>
    );
};

export default SignUpForm;
