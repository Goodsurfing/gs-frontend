import React, { FC } from "react";

import LocaleLink from "@/components/LocaleLink/LocaleLink";

import ProfileInfoForm from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm";

import styles from "./ProfileInfoPage.module.scss";

const ProfileInfoPage: FC = () => {
    return (
        <main className={styles.main}>
            <div className={styles.title}>
                <h2>Основная информация</h2>
                <LocaleLink className={styles.link} to={"/edit"}>
                    Редактировать профиль
                </LocaleLink>
            </div>
            <div className={styles.form}>
                <ProfileInfoForm />
            </div>
        </main>
    );
};

export default ProfileInfoPage;
