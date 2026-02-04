import { FC } from "react";

import { useTranslation } from "react-i18next";

import { ProfileInfoForm } from "@/features/ProfileInfo";

import styles from "./ProfileInfoPage.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const ProfileInfoPage: FC = () => {
    const { t, ready } = useTranslation("profile");

    if (!ready) {
        return (
            <main className={styles.wrapper}>
                <MiniLoader />
            </main>
        );
    }

    return (
        <main className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>{t("info.Основная информация")}</h2>
            </div>
            <ProfileInfoForm className={styles.info} />
        </main>
    );
};

export default ProfileInfoPage;
