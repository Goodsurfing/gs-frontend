import { memo } from "react";

import cn from "classnames";

import { useTranslation } from "react-i18next";
import { ProfileInfoForm } from "../ProfileInfoForm/ProfileInfoForm";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import styles from "./ProfileInfo.module.scss";

interface ProfileInfoProps {
    className?: string;
}

export const ProfileInfo = memo((props: ProfileInfoProps) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const { myProfile, profileIsLoading, profileIsError } = useAuth();

    if (profileIsError) {
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.header} />
            <div className={styles.body}>
                {t("info.Произошла ошибка")}
            </div>
        </div>;
    }

    if (profileIsLoading) {
        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.header} />
                <div className={styles.body}>
                    <MiniLoader />
                </div>
            </div>
        );
    }

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.header} />
            <div className={styles.body}>
                {myProfile && <ProfileInfoForm profile={myProfile} />}
            </div>
        </div>
    );
});
