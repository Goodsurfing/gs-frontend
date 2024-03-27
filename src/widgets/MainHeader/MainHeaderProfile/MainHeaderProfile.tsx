import React, { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import Popup from "@/components/Popup/Popup";

import { userActions } from "@/entities/User";

import {
    getHostDashboardPageUrl,
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
    const { t } = useTranslation();

    const profileRef = useRef(null);

    const { locale } = useLocale();
    const { data: userInfo } = profileApi.useGetProfileInfoQuery();

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
                    {t("main.welcome.header.my-page")}
                </Link>
                <Link
                    className={styles.dropdownLink}
                    to={getProfileInfoPageUrl(locale)}
                    replace
                >
                    {t("main.welcome.header.my-page")}
                </Link>
                <Link
                    className={styles.dropdownLink}
                    to={getHostDashboardPageUrl(locale)}
                    replace
                >
                    {t("main.welcome.header.host-dashboard")}
                </Link>
                <Link
                    className={styles.dropdownLink}
                    to={getVolunteerDashboardPageUrl(locale)}
                >
                    {t("main.welcome.header.volunteer-dashboard")}
                </Link>
                <button
                    type="button"
                    className={styles.dropdownLink}
                    onClick={handleLogout}
                >
                    {t("main.welcome.header.exit")}
                </button>
            </Popup>
        </div>
    );
};

export default MainHeaderProfile;
