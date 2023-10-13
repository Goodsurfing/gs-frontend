import Popup from "@/components/Popup/Popup";
import { userInfoApi } from "@/store/api/userInfoApi";
import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { userActions } from "@/entities/User";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";
import {
    getHostDashboardPageUrl,
    getMainPageUrl,
    getProfileInfoPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useAppDispatch } from "@/shared/hooks/redux";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import Arrow from "../../Arrow/Arrow";
import styles from "./MainHeaderProfile.module.scss";

const MainHeaderProfile = () => {
    const [isProfileOpened, setProfileOpened] = useState<boolean>(false);

    const profileRef = useRef(null);

    const { locale } = useLocale();

    const { data: userInfo } = userInfoApi.useGetUserInfoQuery();

    const dispatch = useAppDispatch();

    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
    }, [dispatch]);

    useOnClickOutside(profileRef, () => setProfileOpened(false));

    const handleCloseDropdown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Escape") {
                setProfileOpened((prev) => !prev);
            }
        },
        []
    );

    let username: string = userInfo ? userInfo.firstName : "Анон";

    if (username === null) {
        username = "Анон";
    }

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
            <p className={styles.name}>{username}</p>
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
                    to={getMainPageUrl(locale)}
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
