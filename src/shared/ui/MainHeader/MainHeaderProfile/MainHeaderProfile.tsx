import React, { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import Popup from "@/components/Popup/Popup";

import { useAppDispatch } from "@/shared/hooks/redux";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import { userInfoApi } from "@/store/api/userInfoApi";
import { logout } from "@/store/reducers/loginSlice";

import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";

import Arrow from "../../Arrow/Arrow";
import styles from "./MainHeaderProfile.module.scss";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";
import { RoutePath } from "@/routes/model/config/RouterConfig";
import {
    getHostPageUrl, getMainPageUrl, getProfileInfoPageUrl, useLocale,
} from "@/routes";

const MainHeaderProfile = () => {
    const [isProfileOpened, setProfileOpened] = useState<boolean>(false);

    const profileRef = useRef(null);

    const { locale } = useLocale();

    const { data: userInfo } = userInfoApi.useGetUserInfoQuery();

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    useOnClickOutside(profileRef, () => setProfileOpened(false));

    const handleCloseDropdown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            setProfileOpened((prev) => !prev);
        }
    }, []);

    let username: string = userInfo ? userInfo.firstName : "Анон";

    if (username === null) {
        username = "Анон";
    }

    return (
        <div
            ref={profileRef}
            onClick={() => setProfileOpened(!isProfileOpened)}
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
                    to={`/${RoutePath.profile_info}`}
                    replace
                >
                    Обо мне

                </Link>
                <Link
                    className={styles.dropdownLink}
                    to={getHostPageUrl(locale)}
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
                <Button
                    variant={Variant.CLEAR}
                    className={styles.dropdownLink}
                    onClick={handleLogout}
                >
                    Выйти
                </Button>
            </Popup>
        </div>
    );
};

export default MainHeaderProfile;
