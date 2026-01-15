import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Controller, SubmitHandler, useForm, useWatch,
} from "react-hook-form";
import InputField from "@/components/InputField/InputField";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import Button from "@/shared/ui/Button/Button";
import styles from "./VerifyEmailForm.module.scss";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import { useAuth } from "@/routes/model/guards/AuthProvider";
// import Input from "@/shared/ui/Input/Input";

interface FormDataImplemintaion {
    email: string;
    newPassword: string;
    repeatNewPassword: string;
}

export const VerifyEmailForm = () => {
    const { t } = useTranslation();
    const [toast, setToast] = useState<ToastAlert>();
    const [isEmailSend, setEmailSend] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { token } = useAuth();
    const [cooldown, setCooldown] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const {
        control, handleSubmit, getValues,
    } = useForm<FormDataImplemintaion>({
        mode: "onChange",
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newPassword = useWatch({
        control,
        name: "newPassword",
        defaultValue: "",
    });

    useEffect(() => () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, []);

    const sendEmailVerification = async (email: string) => {
        if (cooldown > 0) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL_V3}send-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to send verification email");
            }

            setEmailSend(true);

            setCooldown(60);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            timerRef.current = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch {
            setEmailSend(false);
            setToast({
                text: t("login.Произошла ошибка"),
                type: HintType.Error,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormDataImplemintaion> = async (data) => {
        await sendEmailVerification(data.email);
    };

    const resendEmail = () => {
        const currentEmail = getValues("email");
        if (currentEmail && cooldown === 0) {
            sendEmailVerification(currentEmail);
        }
    };

    if (isEmailSend) {
        return (
            <div className={styles.wrapper}>
                {toast && (
                    <HintPopup text={toast.text} type={toast.type} />
                )}
                <p className={styles.successMessage}>
                    {t("login.Сообщение с подтверждением отправлено на ваш email")}
                </p>
                <Button
                    type="button"
                    variant="OUTLINE"
                    color="BLUE"
                    size="MEDIUM"
                    onClick={resendEmail}
                    disabled={isLoading || cooldown > 0}
                    className={styles.btn}
                >
                    {cooldown > 0
                        ? t("login.Отправить ещё раз через {{seconds}}", { seconds: cooldown })
                        : t("login.Отправить ещё раз")}
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            {toast && (
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
            {/* <Controller
                name="newPassword"
                control={control}
                rules={{ required: t("password.Новый пароль обязателен") }}
                defaultValue=""
                render={({ field, fieldState }) => (
                    <div className={styles.inputWrapper}>
                        <label>{t("password.Новый пароль")}</label>
                        <Input type="password" {...field} />
                        {fieldState.error && (
                            <p className={styles.inputError}>
                                {fieldState.error.message}
                            </p>
                        )}
                    </div>
                )}
            />
            <Controller
                name="repeatNewPassword"
                control={control}
                rules={{
                    validate:
                    (value) => value === newPassword || t("password.Пароли должны совпадать"),
                    required: t("password.Повторите новый пароль"),
                }}
                defaultValue=""
                render={({ field, fieldState }) => (
                    <div className={styles.inputWrapper}>
                        <label>{t("password.Повторите новый пароль")}</label>
                        <Input type="password" {...field} />
                        {fieldState.error && (
                            <p className={styles.inputError}>
                                {fieldState.error.message}
                            </p>
                        )}
                    </div>
                )}
            /> */}
            <Button
                type="submit"
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
                className={styles.btn}
                disabled={isLoading}
            >
                {t("login.Подтвердить")}
            </Button>
            <div className={styles.confirm}>
                {t("login.Вам на почту придёт письмо с подтверждением")}
                .
            </div>
        </form>
    );
};
