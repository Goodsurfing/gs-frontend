import React, { FC } from "react";
import { useLocation } from "react-router-dom";

import MainHeader from "@/components/MainHeader/MainHeader";
import Sidebar from "@/components/Sidebar/Sidebar";
import SidebarContent from "@/components/Sidebar/SidebarContent/SidebarContent";

import ProfileInfoPage from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoPage";
import { SidebarNavigationLinksData } from "@/pages/ProfilePages/ProfilePage/ProfilePage.data";
import ProfileResetPasswordPage from "@/pages/ProfilePages/ProfileResetPasswordPage/ProfileResetPasswordPage";

import { isMatchUrlEndpoint } from "@/utils/url/isMatchUrlEndpoint";

import styles from "./ProfilePage.module.scss";

const ProfilePage: FC = () => {
    const { pathname } = useLocation();

    const createContent = (pathname: string) => {
        if (isMatchUrlEndpoint(pathname, "info")) {
            return <ProfileInfoPage />;
        }
        if (isMatchUrlEndpoint(pathname, "reset-password")) {
            return <ProfileResetPasswordPage />;
        }
    };

    return (
        <>
            <MainHeader />
            <div className={styles.wrapper}>
                <Sidebar>
                    <SidebarContent
                        navigationLink={SidebarNavigationLinksData}
                    />
                </Sidebar>
                <div className={styles.content}>{createContent(pathname)}</div>
            </div>
        </>
    );
};

export default ProfilePage;
