import { FC } from "react";

import { SideMenuData } from "@/shared/data/sidebar/profile-pages";

import { PageLayout } from "@/widgets/PageLayout";

import styles from "./ProfileRolePage.module.scss";
import { ProfileRoleWidget } from "@/widgets/ProfileRoleWidget/ProfileRoleWidget";

const ProfileRolePage: FC = () => (
    <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
        <main className={styles.wrapper}>
            <h2 className={styles.title}>Заполните аккаунт гудсёрфера или организатора</h2>
            <p className={styles.description}>
                В новой версии Гудсёрфинга вы можете быть одновременно и
                гудсёрфером-путешественником и организатором,
                который выступает принимающей стороной.
            </p>
            <br />
            <p className={styles.description}>
                Для каждой роли есть отдельный рабочий стол,
                {" "}
                в котором отражается вся необходимая информация.
                {" "}
                Выберите роль, перейдите на рабочий стол и
                заполните профиль гудсёрфера или профиль организации.
            </p>
            <ProfileRoleWidget />
        </main>
    </PageLayout>
);

export default ProfileRolePage;
