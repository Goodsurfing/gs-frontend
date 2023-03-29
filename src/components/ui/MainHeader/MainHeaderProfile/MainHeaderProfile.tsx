import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Popup from "@/components/Popup/Popup";

import { useAppDispatch } from "@/hooks/redux";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import { userInfoApi } from "@/store/api/userInfoApi";
import { logout } from "@/store/reducers/loginSlice";

import defaultAvatarImage from "@/assets/images/default-avatar.jpg";

import Arrow from "../../Arrow/Arrow";
import styles from "./MainHeaderProfile.module.scss";

const MainHeaderProfile = () => {
    const [isProfileOpened, setProfileOpened] = useState<boolean>(false);

    const profileRef = useRef(null);

    const { data: userInfo } = userInfoApi.useGetUserInfoQuery();

    console.log(userInfo);

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    useOnClickOutside(profileRef, () => setProfileOpened(false));

    let username: string = userInfo ? userInfo.firstName : 'Анон';

    if (username === null) {
        username = 'Анон'
    }

    return (
        <div
            ref={profileRef}
            onClick={() => setProfileOpened(!isProfileOpened)}
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
                <Link to="/profile/info">Моя страница</Link>
                <Link to="/profile/info">Обо мне</Link>
                <Link to="/host/dashboard">Дашборд хоста</Link>
                <Link to="/">Стать волонтёром</Link>
                <a onClick={handleLogout}>Выйти</a>
            </Popup>
        </div>
    );
};

export default MainHeaderProfile;
