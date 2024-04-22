import { FC } from "react";

import { useTranslation } from "react-i18next";
import { useProfileSidebarData } from "@/shared/data/sidebar/profile-pages";

import { ProfileInfoForm } from "@/features/ProfileInfo";

import { PageLayout } from "@/widgets/PageLayout";

import styles from "./ProfileInfoPage.module.scss";

const ProfileInfoPage: FC = () => {
    const { t } = useTranslation("about-me");
    const { SideMenuData } = useProfileSidebarData();
    return (
        <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
            <main className={styles.wrapper}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>{t("Основная информация")}</h2>
                </div>
                <ProfileInfoForm />
            </main>
        </PageLayout>
    );
};

export default ProfileInfoPage;
