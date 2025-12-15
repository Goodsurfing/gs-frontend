import React, {
    ChangeEvent,
    FC, memo, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import {
    ProfileDeleteSwitch,
    ProfileHideSwitch,
    ProfileNewsletterSwitch,
} from "@/features/ProfilePrivacy";

import styles from "./ProfilePrivacy.module.scss";
import { useToggleActiveProfileMutation } from "@/entities/Profile";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useAuth } from "@/routes/model/guards/AuthProvider";

export const ProfilePrivacy: FC = memo(() => {
    const { t } = useTranslation("profile");
    const { myProfile, profileIsLoading } = useAuth();
    const [toggleActive] = useToggleActiveProfileMutation();
    const [isActiveProfile, setActiveProfile] = useState<boolean>(false);

    const updateToggleActiveProfile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        if (myProfile) {
            await toggleActive({
                profileId: myProfile.id,
                body: { isActive: event.target.checked },
            }).unwrap();
        }
    }, [myProfile, toggleActive]);

    useEffect(() => {
        if (myProfile) {
            setActiveProfile(myProfile.isActive);
        }
    }, [myProfile]);

    if (profileIsLoading) {
        return <MiniLoader />;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <ProfileHideSwitch
                    checked={isActiveProfile}
                    onChange={updateToggleActiveProfile}
                />
                <p className={styles.description}>
                    {t("privacy.Деактивировав аккаунт вы делаете его недоступным для остальных")}
                </p>
            </div>
            <div className={styles.container}>
                <ProfileNewsletterSwitch />
                <p className={styles.description}>
                    {t("privacy.Отказавшись от рассылки вы можете пропустить важные новости проекта, а также уникальные возможности")}
                </p>
            </div>
            <div className={styles.container}>
                <ProfileDeleteSwitch />
                <div className={styles.iconContainer}>
                    <div className={styles.errorLineIcon} />
                    <p className={styles.description}>
                        {t("privacy.Нажимая эту кнопку вы удаляете ваш аккаунт со всей заполненной вами информацией")}
                    </p>
                </div>
            </div>
        </div>
    );
});
