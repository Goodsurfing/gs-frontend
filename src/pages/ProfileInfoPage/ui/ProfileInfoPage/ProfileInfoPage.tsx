import { FC, useCallback, useState } from "react";

import ProfileInfoForm from "../ProfileInfoForm/ProfileInfoForm";

import styles from "./ProfileInfoPage.module.scss";
import { PageLayout } from "@/widgets/PageLayout";

import { SideMenuData } from "@/shared/data/profile-pages";

const ProfileInfoPage: FC = () => {
    const [isLocked, setIsLocked] = useState<boolean>(true);

    const handleReadonlyChange = useCallback(() => {
        setIsLocked(!isLocked);
    }, [isLocked]);

    return (
        <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
            <main className={styles.wrapper}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Основная информация</h2>
                    <button
                        onClick={handleReadonlyChange}
                        className={styles.link}
                    >
                        {isLocked ? "Редактировать профиль" : "Посмотреть профиль"}
                    </button>
                </div>
                <div className={styles.form}>
                    <ProfileInfoForm onSuccess={handleReadonlyChange} isLocked={isLocked} />
                </div>
            </main>
        </PageLayout>
    );
};

export default ProfileInfoPage;
