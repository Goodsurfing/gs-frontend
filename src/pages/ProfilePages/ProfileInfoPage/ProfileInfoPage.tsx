import React, { FC, useState } from "react";

import ProfileInfoForm from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm";

import styles from "./ProfileInfoPage.module.scss";

interface IProfileInfoPage {
    isOpen: boolean;
}

const ProfileInfoPage: FC<IProfileInfoPage> = ({ isOpen }) => {
    const [isLocked, setIsLocked] = useState<boolean>(true);

    return (
        <main className={styles.wrapper}>
            <div className={styles.title}>
                <h2>Основная информация</h2>
                <p
                    onClick={() => setIsLocked(!isLocked)}
                    className={styles.link}
                >
                    {isLocked ? "Редактировать профиль" : "Посмотреть профиль"}
                </p>
            </div>
            <div className={styles.form}>
                <ProfileInfoForm isLocked={isLocked} />
            </div>
        </main>
    );
};

export default ProfileInfoPage;
