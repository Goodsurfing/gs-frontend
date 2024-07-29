import React, { FC } from "react";

import { ProfilePrivacy } from "@/widgets/ProfilePrivacy";

import styles from "./ProfilePrivacyPage.module.scss";

const ProfilePrivacyPage: FC = () => (
    <main className={styles.wrapper}>
        <div className={styles.titleWrapper}>
            <h2 className={styles.title}>
                Заполните аккаунт гудсёрфера или организатора
            </h2>
            <p className={styles.description}>
                Гудсёрфинг — это социальная сеть людей, которые уже
                путешествуют со смыслом или только хотят начать это делать.
                Гудсёрфинг позволяет находить новые возможности, знакомиться
                с людьми, рассказать о себе. Развитие Гудсёрфинга зависит от
                вашего участия и открытости. Вы можете сами определить
                степень вашей открытости.
            </p>
        </div>
        <ProfilePrivacy />
    </main>
);

export default ProfilePrivacyPage;
