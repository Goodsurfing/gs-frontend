import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { ProfileRoleWidget } from "@/widgets/ProfileRoleWidget/ProfileRoleWidget";

import styles from "./ProfileRolePage.module.scss";

const ProfileRolePage: FC = () => {
    const { t } = useTranslation("profile");
    return (
        <main className={styles.wrapper}>
            <h2 className={styles.title}>
                {t("role.Заполните аккаунт гудсёрфера или организатора")}
            </h2>
            <p className={styles.description}>
                {t("role.В новой версии Гудсёрфинга вы можете быть одновременно и гудсёрфером-путешественником и организатором, который выступает принимающей стороной.")}
            </p>
            <br />
            <p className={styles.description}>
                {t("role.Для каждой роли есть отдельный рабочий стол, в котором отражается вся необходимая информация. Выберите роль, перейдите на рабочий стол и заполните профиль гудсёрфера или профиль организации.")}
            </p>
            <ProfileRoleWidget />
        </main>
    );
};

export default ProfileRolePage;
