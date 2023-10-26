import React, { FC } from "react";

import styles from "./ProfilePrivacyPage.module.scss";
import { PageLayout } from "@/widgets/PageLayout";
import { SideMenuData } from "@/shared/data/sidebar/profile-pages";

const ProfilePrivacyPage:FC = () => (
    <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
        <main className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Заполните аккаунт гудсёрфера или организатора</h2>
            </div>

        </main>
    </PageLayout>
);

export default ProfilePrivacyPage;
