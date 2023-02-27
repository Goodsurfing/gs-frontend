import React, { FC } from "react";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import MobileHeader from "@/components/MobileHeader/MobileHeader";
import Arrow from "@/components/ui/Arrow/Arrow";

import heartIcon from "@/assets/icons/heart-icon.svg";
import logotypeIcon from "@/assets/icons/logo-black.svg";
import messagesIcon from "@/assets/icons/message_icon.svg";
import defaultAvatarImage from "@/assets/images/default-avatar.jpg";

import styles from "./MainHeader.module.scss";

const MainHeader: FC = () => {
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
                    <div className={styles.info}>
                        <p className={styles.name}>Владислав</p>
                        <img
                            src={defaultAvatarImage}
                            alt="NAME"
                            className={styles.avatar}
                        />
                        <Arrow isOpen={false} />
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
