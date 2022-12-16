import React, { FC } from "react";

import MainHeader from "@/components/MainHeader/MainHeader";
import Sidebar from "@/components/Sidebar/Sidebar";
import SidebarContent from "@/components/Sidebar/SidebarContent/SidebarContent";

import ProfileInfoPage from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoPage";
import { SidebarNavigationLinksData } from "@/pages/ProfilePages/ProfilePage/ProfilePage.data";

import styles from "./ProfilePage.module.scss";

const ProfilePage: FC = () => {
    return (
        <>
            <MainHeader />
            <div className={styles.wrapper}>
                <Sidebar>
                    <SidebarContent
                        navigationLink={SidebarNavigationLinksData}
                    />
                </Sidebar>
                <div className={styles.content}>
                    <ProfileInfoPage />
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
