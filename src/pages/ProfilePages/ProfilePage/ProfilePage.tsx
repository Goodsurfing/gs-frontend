import React, { FC } from "react";

import MainHeader from "@/components/MainHeader/MainHeader";
import Sidebar from "@/components/Sidebar/Sidebar";

import SidebarContent from "@/pages/ProfilePages/ProfilePage/SidebarContent/SidebarContent";

import styles from "./ProfilePage.module.scss";

const ProfilePage: FC = () => {
    return (
        <>
            <MainHeader />
            <div className={styles.wrapper}>
                <Sidebar>
                    <SidebarContent />
                </Sidebar>
                <div className={styles.content}>
                    <h1>content</h1>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
