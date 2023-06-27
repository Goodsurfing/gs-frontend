import React, { FC, useState } from "react";

import ProfileInfoForm from "../ProfileInfoForm/ProfileInfoForm";

import styles from "./ProfileInfoPage.module.scss";
import { PageLayout } from "@/widgets/PageLayout";

import { SideMenuData } from "@/shared/data/profile-pages";

const ProfileInfoPage: FC = () => {
    const [isLocked, setIsLocked] = useState<boolean>(true);

    return (
        <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
            <main className={styles.wrapper}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Основная информация</h2>
                    <p
                        onClick={() => { return setIsLocked(!isLocked); }}
                        className={styles.link}
                    >
                        {isLocked ? "Редактировать профиль" : "Посмотреть профиль"}
                    </p>
                </div>
                <div className={styles.form}>
                    <ProfileInfoForm isLocked={isLocked} />
                </div>
            </main>
        </PageLayout>
    );
};

export default ProfileInfoPage;