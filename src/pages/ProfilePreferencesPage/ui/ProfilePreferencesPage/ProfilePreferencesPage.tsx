import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ProfilePreferencesForm } from "@/widgets/ProfilePreferencesForm";
import styles from "./ProfilePreferencesPage.module.scss";
import { useGetProfileInfoQuery } from "@/entities/Profile";
import Preloader from "@/shared/ui/Preloader/Preloader";

const ProfilePreferencesPage: FC = () => {
    const { data, isLoading } = useGetProfileInfoQuery();
    const { t, ready } = useTranslation("profile");

    if (isLoading || !ready) {
        return <Preloader />;
    }

    return (
        <main className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>{t("preferences.Куда бы вы хотели поехать")}</h2>
                {data && (
                    <ProfilePreferencesForm profileId={data.id} />
                )}
            </div>
        </main>
    );
};

export default ProfilePreferencesPage;
