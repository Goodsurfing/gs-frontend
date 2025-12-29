import React, {
    ChangeEvent,
    FC, memo, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    ProfileDeleteSwitch,
    ProfileHideSwitch,
    ProfileNewsletterSwitch,
} from "@/features/ProfilePrivacy";

import { useDeleteProfileMutation, useToggleActiveProfileMutation } from "@/entities/Profile";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useAppDispatch } from "@/shared/hooks/redux";
import { userActions } from "@/entities/User";
import styles from "./ProfilePrivacy.module.scss";

export const ProfilePrivacy: FC = memo(() => {
    const { t } = useTranslation("profile");
    const { locale } = useLocale();
    const { myProfile, profileIsLoading } = useAuth();
    const [toggleActive, {
        isLoading: isToggleActiveLoading,
    }] = useToggleActiveProfileMutation();
    const [deleteProfile, { isLoading: isProfileLoading }] = useDeleteProfileMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isActiveProfile, setActiveProfile] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastAlert>();

    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
        navigate(getMainPageUrl(locale));
    }, [dispatch, locale, navigate]);

    const handleDeleteProfile = useCallback(async () => {
        if (!myProfile || isProfileLoading) return;
        try {
            await deleteProfile(myProfile.id).unwrap();
            handleLogout();
            navigate(getMainPageUrl(locale));
        } catch (e) {
            setToast({
                type: HintType.Error,
                text: t("profile.Ошибка при удалении профиля"),
            });
        }
    }, [deleteProfile, handleLogout, isProfileLoading, locale, myProfile, navigate, t]);
    const debounceDelay = 500;
    const toggleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const scheduleToggleActive = useCallback((checked: boolean) => {
        if (toggleTimerRef.current) {
            clearTimeout(toggleTimerRef.current);
        }
        toggleTimerRef.current = setTimeout(async () => {
            if (myProfile) {
                try {
                    await toggleActive({
                        body: { isActive: !checked },
                    }).unwrap();
                } catch (e) {
                    setToast({
                        type: HintType.Error,
                        text: t("profile.Ошибка при изменении статуса активности профиля"),
                    });
                }
            }
            toggleTimerRef.current = null;
        }, debounceDelay);
    }, [myProfile, t, toggleActive]);

    const updateToggleActiveProfile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        setActiveProfile(checked);
        scheduleToggleActive(checked);
    }, [scheduleToggleActive]);

    useEffect(() => {
        if (myProfile) {
            setActiveProfile(!myProfile.isActive);
        }
    }, [myProfile]);

    useEffect(() => () => {
        if (toggleTimerRef.current) {
            clearTimeout(toggleTimerRef.current);
            toggleTimerRef.current = null;
        }
    }, []);

    if (profileIsLoading) {
        return <MiniLoader />;
    }

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.container}>
                <ProfileHideSwitch
                    disabled={isToggleActiveLoading}
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
                <ProfileDeleteSwitch onClick={handleDeleteProfile} />
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
