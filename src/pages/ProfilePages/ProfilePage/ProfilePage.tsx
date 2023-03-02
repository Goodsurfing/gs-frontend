import React, { FC, useState } from "react";
import { useLocation } from "react-router-dom";

import MainHeader from "@/components/MainHeader/MainHeader";
import SideMenu from "@/components/SideMenu/SideMenu";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";

import ProfileInfoPage from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoPage";
import { SideMenuData } from "@/pages/ProfilePages/ProfilePage/ProfilePage.data";
import ProfileResetPasswordPage from "@/pages/ProfilePages/ProfileResetPasswordPage/ProfileResetPasswordPage";

import { isMatchUrlEndpoint } from "@/utils/url/isMatchUrlEndpoint";

import styles from "./ProfilePage.module.scss";

const ProfilePage: FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false)
    const { pathname } = useLocation();

    const createContent = (path: string) => {
        if (isMatchUrlEndpoint(path, "info")) {
            return <ProfileInfoPage />;
        }
        if (isMatchUrlEndpoint(path, "reset-password")) {
            return <ProfileResetPasswordPage />;
        }
    };

    return (
        <>
            <MainHeader />
            <div className={styles.wrapper}>
                <SideMenu setOpen={setOpen} isOpen={isOpen} theme={Theme.DARK} content={SideMenuData} />
                <div className={styles.content}>{createContent(pathname)}</div>
            </div>
        </>
    );
};

export default ProfilePage;
