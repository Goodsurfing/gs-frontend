import { FC } from "react";

import { SideMenuData } from "@/shared/data/sidebar/profile-pages";

import { PageLayout } from "@/widgets/PageLayout";

import styles from "./ProfilePreferencesPage.module.scss";
import { ProfilePreferencesForm } from "@/widgets/ProfilePreferencesForm";

const ProfilePreferencesPage: FC = () => (
    <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
        <main className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Куда бы вы хотели поехать</h2>
                <ProfilePreferencesForm />
            </div>
        </main>
    </PageLayout>
);

export default ProfilePreferencesPage;
