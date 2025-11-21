import React from "react";
import { useTranslation } from "react-i18next";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";
import { VerifyEmailForm } from "@/features/VerifyEmailForm";
import styles from "./VerifyEmailWidget.module.scss";

export const VerifyEmailWidget = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.wrapper}>
            <SignTitle>{t("login.Подтверждение почты")}</SignTitle>
            <VerifyEmailForm />
            <div className={styles.confirm}>
                {t("login.Вам на почту придёт письмо с подтверждением")}
                .
            </div>
        </div>
    );
};
