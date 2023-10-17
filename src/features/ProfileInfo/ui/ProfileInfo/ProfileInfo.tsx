import { memo } from "react";

import cn from "classnames";

import styles from "./ProfileInfo.module.scss";
import { useUser } from "@/entities/Profile";
import { ProfileInfoForm } from "../ProfileInfoForm/ProfileInfoForm";
import Preloader from "@/shared/ui/Preloader/Preloader";

interface ProfileInfoProps {
    className?: string;
}

export const ProfileInfo = memo((props: ProfileInfoProps) => {
    const { className } = props;

    const { error, isLoading, profile } = useUser();

    if (error) {
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.header} />
            <div className={styles.body}>
                Произошла ошибка
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
