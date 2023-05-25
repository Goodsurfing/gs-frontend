import React, { FC } from "react";

import ProfileResetPasswordForm from "pages/ProfilePages/ProfileResetPasswordPage/ProfileResetPasswordForm/ProfileResetPasswordForm";

import styles from "./ProfileResetPasswordPage.module.scss";

const ProfileResetPasswordPage: FC = () => (
    <main className={styles.main}>
        <div className={styles.title}>
            <h2>Изменение пароля</h2>
        </div>
        <div className={styles.form}>
            <ProfileResetPasswordForm />
        </div>
    </main>
);

export default ProfileResetPasswordPage;
