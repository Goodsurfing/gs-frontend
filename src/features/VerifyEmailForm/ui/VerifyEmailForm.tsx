import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/InputField/InputField";
import { IVerifyFormData } from "@/types/api/auth/register.interface";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import Button from "@/shared/ui/Button/Button";
import styles from "./VerifyEmailForm.module.scss";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import { useAuth } from "@/routes/model/guards/AuthProvider";

export const VerifyEmailForm = () => {
    const { t } = useTranslation();
    const [toast, setToast] = useState<ToastAlert>();
    const [isEmailSend, setEmailSend] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { token } = useAuth();

    const {
        control, handleSubmit, getValues,
    } = useForm<IVerifyFormData>({
        mode: "onChange",
    });

    const sendEmailVerification = async (email: string) => {
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

    const onSubmit: SubmitHandler<IVerifyFormData> = async (data) => {
        await sendEmailVerification(data.email);
    };

    const resendEmail = () => {
        const currentEmail = getValues("email");
        if (currentEmail) {
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
                    disabled={isLoading}
                    className={styles.btn}
                >
                    {t("login.Отправить ещё раз")}
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
        </form>
    );
};
