import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { ProfilePrivacy } from "@/widgets/ProfilePrivacy";

import styles from "./ProfilePrivacyPage.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";

const ProfilePrivacyPage: FC = () => {
    const { t, ready } = useTranslation("profile");

    if (!ready) {
        return (
            <Preloader />
        );
    }

    return (
        <main className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>
                    {t("privacy.Заполните аккаунт гудсёрфера или организатора")}
                </h2>
                <p className={styles.description}>
                    {t("privacy.Гудсёрфинг — это социальная сеть людей, которые уже путешествуют")}
                </p>
            </div>
            <ProfilePrivacy />
        </main>
    );
};

export default ProfilePrivacyPage;
