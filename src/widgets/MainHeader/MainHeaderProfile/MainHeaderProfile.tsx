import React, {
    FC, useCallback, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Popup from "@/components/Popup/Popup";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Profile } from "@/entities/Profile";
import { userActions } from "@/entities/User";

import {
    getHostDashboardPageUrl,
    getMainPageUrl,
    getProfileInfoPageUrl,
    getVolunteerDashboardPageUrl,
    getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useAppDispatch } from "@/shared/hooks/redux";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import Arrow from "@/shared/ui/Arrow/Arrow";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import styles from "./MainHeaderProfile.module.scss";
import { textSlice } from "@/shared/lib/textSlice";

interface MainHeaderProfileProps {
    profileData?: Profile;
    isLoading: boolean;
}

const MainHeaderProfile: FC<MainHeaderProfileProps> = (props) => {
    const { profileData, isLoading } = props;
    const [isProfileOpened, setProfileOpened] = useState<boolean>(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const profileRef = useRef(null);

    const { locale } = useLocale();

    const dispatch = useAppDispatch();

    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
        navigate(getMainPageUrl(locale));
    }, [dispatch, locale, navigate]);

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

    if (!profileData || isLoading) {
        return (
            <div
                ref={profileRef}
                onClick={handleProfileOpen}
                onKeyDown={handleCloseDropdown}
                className={styles.info}
            >
                <MiniLoader />
            </div>
        );
    }

    return (
        <div
            ref={profileRef}
            onClick={handleProfileOpen}
            onKeyDown={handleCloseDropdown}
            className={styles.info}
        >
            <p className={styles.name}>
                {textSlice(profileData.firstName, 13, "none") || textSlice(profileData.email, 13, "none")}
            </p>
            <Avatar
                icon={getMediaContent(profileData.image)}
                text={profileData.firstName}
                alt="avatar"
                size="SMALL"
                className={styles.avatar}
            />
            <Arrow isOpen={isProfileOpened} />
            <Popup className={styles.popup} isOpen={isProfileOpened}>
                <Link
                    className={styles.dropdownLink}
                    to={getVolunteerPersonalPageUrl(locale, profileData.id)}
                    replace
                >
                    {t("main.welcome.header.my-page")}
                </Link>
                <Link
                    className={styles.dropdownLink}
                    to={getProfileInfoPageUrl(locale)}
                    replace
                >
                    {t("main.welcome.header.about-me")}
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
