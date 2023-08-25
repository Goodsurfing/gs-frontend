import { FC } from "react";

import { SideMenuData } from "@/shared/data/sidebar/profile-pages";

import { ProfileInfoForm } from "@/features/ProfileInfo";

import { PageLayout } from "@/widgets/PageLayout";

import styles from "./ProfileInfoPage.module.scss";

const ProfileInfoPage: FC = () => (
    <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
        <main className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Основная информация</h2>
            </div>
            <ProfileInfoForm />
        </main>
    </PageLayout>
);

export default ProfileInfoPage;
