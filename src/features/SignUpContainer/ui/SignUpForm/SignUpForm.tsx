import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import AuthInputField from "@/shared/ui/AuthInputField/AuthInputField";
import Checkbox from "@/shared/ui/Checkbox/Checkbox";
import LocaleLink from "@/shared/ui/LocaleLink/LocaleLink";

import { useAppDispatch } from "@/shared/hooks/redux";

import { getConfirmEmailPageUrl, getResetPasswordPageUrl, getSignInPageUrl } from "@/shared/config/routes/AppUrls";

import { authApi } from "@/store/api/authApi";
import { setRegisterUserData } from "@/store/reducers/registerSlice";

import { IAuthFormData, IRegisterFormData } from "@/types/api/auth/register.interface";

import { marketingConsentWording } from "../../lib/marketingConsentIntent";
import styles from "./SignUpForm.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { trackGoal } from "@/shared/lib/analytics";

interface SignUpFormProps {
    /** Чекбокс «Хочу получать письма…» (GS-203) — общий с входом через VK */
    marketingConsent?: boolean;
    onMarketingConsentChange?: (value: boolean) => void;
}

const SignUpForm: FC<SignUpFormProps> = ({
    marketingConsent = true,
    onMarketingConsentChange,
}) => {
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
            marketingConsent,
            ...(marketingConsent ? { marketingConsentWording: marketingConsentWording(t) } : {}),
        };
        await registerUser(formData)
            .unwrap()
            .then((response) => {
                dispatch(setRegisterUserData(response));
                trackGoal("signup");
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
            <Checkbox
                id="signup-marketing-consent"
                isChecked={marketingConsent}
                onChange={() => onMarketingConsentChange?.(!marketingConsent)}
                text={t("login.Хочу получать письма о новых проектах, акциях и новостях Гудсёрфинга")}
            />
            <p className={styles.consentHint}>{t("login.marketingConsentHint")}</p>
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
