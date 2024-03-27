import React, { FC } from "react";

import ProfileResetPasswordForm from "@/pages/ProfileResetPasswordPage/ui/ProfileResetPasswordForm/ProfileResetPasswordForm";

import { PageLayout } from "@/widgets/PageLayout";

import { useProfileSidebarData } from "@/shared/data/sidebar/profile-pages";

import styles from "./ProfileResetPasswordPage.module.scss";

const ProfileResetPasswordPage: FC = () => {
    const { SideMenuData } = useProfileSidebarData();
    return (
        <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
            <main className={styles.main}>
                <div className={styles.title}>
                    <h2>Изменение пароля</h2>
                </div>
                <div className={styles.form}>
                    <ProfileResetPasswordForm />
                </div>
            </main>
        </PageLayout>
    );
};

export default ProfileResetPasswordPage;
