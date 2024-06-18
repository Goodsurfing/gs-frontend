import { FC } from "react";

import { useTranslation } from "react-i18next";
import { useProfileSidebarData } from "@/shared/data/sidebar/profile-pages";

import { ProfileInfoForm } from "@/features/ProfileInfo";

import styles from "./ProfileInfoPage.module.scss";

const ProfileInfoPage: FC = () => {
    const { t } = useTranslation("about-me");

    return (
        <main className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>{t("Основная информация")}</h2>
            </div>
            <ProfileInfoForm />
        </main>
    );
};

export default ProfileInfoPage;
