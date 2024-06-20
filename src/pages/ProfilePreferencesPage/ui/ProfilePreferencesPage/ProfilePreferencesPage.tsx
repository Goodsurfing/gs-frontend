import { FC } from "react";
import { ProfilePreferencesForm } from "@/widgets/ProfilePreferencesForm";
import styles from "./ProfilePreferencesPage.module.scss";

const ProfilePreferencesPage: FC = () => (
    <main className={styles.wrapper}>
        <div className={styles.titleWrapper}>
            <h2 className={styles.title}>Куда бы вы хотели поехать</h2>
            <ProfilePreferencesForm />
        </div>
    </main>
);

export default ProfilePreferencesPage;
