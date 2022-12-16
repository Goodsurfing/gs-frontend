import React, { FC } from "react";

import MainHeader from "@/components/MainHeader/MainHeader";
import Sidebar from "@/components/Sidebar/Sidebar";

import styles from "./ProfilePage.module.scss";

const ProfilePage: FC = () => {
    return (
        <>
            <MainHeader />
            <div className={styles.wrapper}>
                <Sidebar />
                <div className={styles.content}>
                    <h1>content</h1>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
