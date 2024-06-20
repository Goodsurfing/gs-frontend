import { memo } from "react";

import cn from "classnames";

import { useTranslation } from "react-i18next";
import { useUser } from "@/entities/Profile";
import { ProfileInfoForm } from "../ProfileInfoForm/ProfileInfoForm";
import Preloader from "@/shared/ui/Preloader/Preloader";
import styles from "./ProfileInfo.module.scss";

interface ProfileInfoProps {
    className?: string;
}

export const ProfileInfo = memo((props: ProfileInfoProps) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const { error, isLoading, profile } = useUser();

    if (error) {
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.header} />
            <div className={styles.body}>
                {t("info.Произошла ошибка")}
            </div>
        </div>;
    }

    if (isLoading) {
        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.header} />
                <div className={styles.body}>
                    <Preloader />
                </div>
            </div>
        );
    }

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.header} />
            <div className={styles.body}>
                {profile && <ProfileInfoForm profile={profile} />}
            </div>
        </div>
    );
});
