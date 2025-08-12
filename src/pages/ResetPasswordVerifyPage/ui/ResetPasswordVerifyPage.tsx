import React, { FC } from "react";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import ResetPasswordThirdStep from "@/containers/ResetPasswordContainer/ResetPasswordThirdStep/ResetPasswordThirdStep";

import styles from "./ResetPasswordVerifyPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { useTranslation } from "react-i18next";

const ResetPasswordVerifyPage: FC = () => {
    const { locale } = useLocale();
    const {t} = useTranslation();

    return (
        <SignLayout cancelText="Отменить" cancelPath={getSignInPageUrl(locale)}>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <SignTitle>{t("login.Восстановление пароля")}</SignTitle>
                    <ResetPasswordThirdStep />
                </div>
            </div>
        </SignLayout>
    );
};

export default ResetPasswordVerifyPage;
