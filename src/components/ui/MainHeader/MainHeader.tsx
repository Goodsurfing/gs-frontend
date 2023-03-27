import React, { FC, useRef, useState } from "react";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import MobileHeader from "@/components/MobileHeader/MobileHeader";
import Arrow from "@/components/ui/Arrow/Arrow";

import heartIcon from "@/assets/icons/heart-icon.svg";
import logotypeIcon from "@/assets/icons/logo-black.svg";
import messagesIcon from "@/assets/icons/message_icon.svg";
import defaultAvatarImage from "@/assets/images/default-avatar.jpg";

import styles from "./MainHeader.module.scss";
import Popup from "@/components/Popup/Popup";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { logout } from "@/store/reducers/loginSlice";
import { useAppDispatch } from "@/hooks/redux";

const MainHeader: FC = () => {
    const [isProfileOpened, setProfileOpened] = useState<boolean>(false);

    const profileRef = useRef(null);

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    useOnClickOutside(profileRef, () => setProfileOpened(false));

    return (
        <>
            <header className={styles.header}>
                <div className={styles.left}>
                    <LocaleLink to="/" className={styles.logo}>
                        <img src={logotypeIcon} alt="GoodSurfing" />
                    </LocaleLink>
                    <ChangeLanguage />
                </div>
                <div className={styles.right}>
                    <div className={styles.icons}>
                        <LocaleLink to="/" className={styles.icon}>
                            <img src={heartIcon} alt="Favorites" />
                        </LocaleLink>
                        <LocaleLink to="/" className={styles.icon}>
                            <img src={messagesIcon} alt="Messages" />
                        </LocaleLink>
                    </div>
                    <div ref={profileRef} onClick={() => setProfileOpened(!isProfileOpened)} className={styles.info}>
                        <p className={styles.name}>Владислав</p>
                        <img
                            src={defaultAvatarImage}
                            alt="NAME"
                            className={styles.avatar}
                        />
                        <Arrow isOpen={isProfileOpened} />
                        <Popup className={styles.popup} isOpen={isProfileOpened}>
                            <Link to='/profile/info'>
                                Моя страница
                            </Link>
                            <Link to='/profile/info'>
                                Обо мне
                            </Link>
                            <Link to='/host/dashboard'>
                                Дашборд хоста
                            </Link>
                            <Link to='/'>
                                Стать волонтёром
                            </Link>
                            <a onClick={handleLogout}>
                                Выйти
                            </a>
                        </Popup>
                    </div>
                </div>
            </header>
            <div className={styles.mobile}>
                <MobileHeader />
            </div>
        </>
    );
};

export default React.memo(MainHeader);
