import heartIcon from "assets/icons/heart-icon.svg";
import logotypeIcon from "assets/icons/logo-black.svg";
import messagesIcon from "assets/icons/message_icon.svg";
import React, { FC, memo } from "react";

import { MobileHeader } from "widgets/MobileHeader";

import { SwitchLanguage } from "features/SwitchLanguage";

import { LocaleLink } from "shared/ui/LocaleLink";

import styles from "./MainHeader.module.scss";
import { MainHeaderProfile } from "./MainHeaderProfile/MainHeaderProfile";

const MainHeader: FC = () => (
    <>
        <header className={styles.header}>
            <div className={styles.left}>
                <LocaleLink to="" className={styles.logo}>
                    <img src={logotypeIcon} alt="GoodSurfing" />
                </LocaleLink>
                <SwitchLanguage />
            </div>
            <div className={styles.right}>
                <div className={styles.icons}>
                    <LocaleLink to="" className={styles.icon}>
                        <img src={heartIcon} alt="Favorites" />
                    </LocaleLink>
                    <LocaleLink to="" className={styles.icon}>
                        <img src={messagesIcon} alt="Messages" />
                    </LocaleLink>
                </div>
                <MainHeaderProfile />
            </div>
        </header>
        <div className={styles.mobile}>
            <MobileHeader />
        </div>
    </>
);

export const MemoMainHeader = memo(MainHeader);
