import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import ProfileResetPasswordForm from "@/pages/ProfileResetPasswordPage/ui/ProfileResetPasswordForm/ProfileResetPasswordForm";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./ProfileResetPasswordPage.module.scss";

const ProfileResetPasswordPage: FC = () => {
    const { t, ready } = useTranslation("profile");

    if (!ready) {
        return (
            <MiniLoader />
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.title}>
                <h2>{t("password.Изменение пароля")}</h2>
            </div>
            <div className={styles.form}>
                <ProfileResetPasswordForm />
            </div>
        </main>
    );
};

export default ProfileResetPasswordPage;
