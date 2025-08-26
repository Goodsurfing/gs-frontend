import {
    FC, useCallback, useEffect, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { authApi } from "@/store/api/authApi";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getSignUpPageUrl } from "@/shared/config/routes/AppUrls";
import { useAppSelector } from "@/shared/hooks/redux";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import styles from "./ConfirmEmailPage.module.scss";

const ConfirmEmailPage: FC = () => {
    const { email } = useAppSelector((state) => state.register);
    const { locale } = useLocale();
    const [resendEmail] = authApi.useResendEmailVerificationMutation();
    const { t } = useTranslation();

    const [cooldown, setCooldown] = useState(0);
    const [firstAttempt, setFirstAttempt] = useState(true);
    const [toast, setToast] = useState<ToastAlert>();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const resendEmailVerification = async () => {
        if (!email) return;
        try {
            await resendEmail({ email }).unwrap();

            const delay = firstAttempt ? 60 : 300;
            setCooldown(delay);
            setFirstAttempt(false);
        } catch {
            setToast({ text: t("login.Произошла ошибка"), type: HintType.Error });
        }
    };

    useEffect(() => {
        if (cooldown > 0) {
            timerRef.current = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [cooldown]);

    const formatTime = useCallback((seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    }, []);

    return (
        <SignLayout cancelText={t("login.Отменить")} cancelPath={getSignUpPageUrl(locale)}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.wrapper}>
                <SignTitle>{t("login.Регистрация пользователя")}</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        {t("login.На")}
                        {" "}
                        <span>{email}</span>
                        {" "}
                        {t("login.было отправлено письмо со ссылкой для подтверждения почты.")}
                    </div>
                    <p>
                        {t("Если вы не видите письмо, проверьте, не попало ли оно в папку «Спам».")}
                    </p>
                    {cooldown > 0 ? (
                        <Button color="BLUE" size="MEDIUM" variant="OUTLINE" disabled>
                            {`${t("login.Отправить можно через")} ${formatTime(cooldown)}`}
                        </Button>
                    ) : (
                        <Button
                            color="BLUE"
                            size="MEDIUM"
                            variant="OUTLINE"
                            onClick={resendEmailVerification}
                        >
                            {t("login.Отправить подтверждение ещё раз")}
                        </Button>
                    )}
                </div>
            </div>
        </SignLayout>
    );
};

export default ConfirmEmailPage;
