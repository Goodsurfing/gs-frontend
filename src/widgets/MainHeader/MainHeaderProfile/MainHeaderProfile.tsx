import React, { useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import Popup from "@/components/Popup/Popup";

import { userActions } from "@/entities/User";

import {
    getHostDashboardPageUrl,
    getMainPageUrl,
    getProfileInfoPageUrl,
    getVolunteerDashboardPageUrl,
} from "@/shared/config/routes/AppUrls";

import { useAppDispatch } from "@/shared/hooks/redux";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import { useLocale } from "@/app/providers/LocaleProvider";
import { profileApi } from "@/entities/Profile";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";
import Arrow from "@/shared/ui/Arrow/Arrow";
import styles from "./MainHeaderProfile.module.scss";

const MainHeaderProfile = () => {
    const [isProfileOpened, setProfileOpened] = useState<boolean>(false);

    const profileRef = useRef(null);

    const { locale } = useLocale();
    const navigate = useNavigate();
    const { data: userInfo } = profileApi.useGetProfileInfoQuery();

    const dispatch = useAppDispatch();

    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
        navigate(getMainPageUrl(locale));
    }, [dispatch, navigate, locale]);

    useOnClickOutside(profileRef, () => setProfileOpened(false));

    const handleCloseDropdown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Escape") {
                setProfileOpened((prev) => !prev);
            }
        },
        [],
    );

    const handleProfileOpen = useCallback(() => {
        setProfileOpened(!isProfileOpened);
    }, [isProfileOpened]);

    return (
        <div
            ref={profileRef}
            onClick={handleProfileOpen}
            onKeyDown={handleCloseDropdown}
            className={styles.info}
        >
            <p className={styles.name}>{userInfo?.firstName || "Анон"}</p>
            <img
                src={defaultAvatarImage}
                alt="NAME"
                className={styles.avatar}
            />
            <Arrow isOpen={isProfileOpened} />
            <Popup className={styles.popup} isOpen={isProfileOpened}>
                <Link
                    className={styles.dropdownLink}
                    to={getProfileInfoPageUrl(locale)}
                    replace
                >
                    Моя страница
                </Link>
                <Link
                    className={styles.dropdownLink}
                    to={`/${getProfileInfoPageUrl(locale)}`}
                    replace
                >
                    Обо мне
                </Link>
                <Link
                    className={styles.dropdownLink}
                    to={getHostDashboardPageUrl(locale)}
                    replace
                >
                    Дашборд хоста
                </Link>
                <Link
                    className={styles.dropdownLink}
                    to={getVolunteerDashboardPageUrl(locale)}
                >
                    Стать волонтёром
                </Link>
                <button
                    type="button"
                    className={styles.dropdownLink}
                    onClick={handleLogout}
                >
                    Выйти
                </button>
            </Popup>
        </div>
    );
};

export default MainHeaderProfile;
