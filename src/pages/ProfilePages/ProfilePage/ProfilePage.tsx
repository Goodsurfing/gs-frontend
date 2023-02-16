import React, { FC } from "react";
import { useLocation } from "react-router-dom";

import MainHeader from "@/components/MainHeader/MainHeader";
import Sidebar from "@/components/Sidebar/Sidebar";
import SidebarContent from "@/components/Sidebar/SidebarContent/SidebarContent";
import SideMenu from "@/components/SideMenu/SideMenu";

import ProfileInfoPage from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoPage";
import { SidebarNavigationLinksData } from "@/pages/ProfilePages/ProfilePage/ProfilePage.data";
import ProfileResetPasswordPage from "@/pages/ProfilePages/ProfileResetPasswordPage/ProfileResetPasswordPage";

import { isMatchUrlEndpoint } from "@/utils/url/isMatchUrlEndpoint";

import styles from "./ProfilePage.module.scss";

import { SideMenuData } from "@/pages/ProfilePages/ProfilePage/ProfilePage.data";

const ProfilePage: FC = () => {
    return (<SideMenu theme='DARK' content={SideMenuData} />)

    // const { pathname } = useLocation();

    // const createContent = (path: string) => {
    //     if (isMatchUrlEndpoint(path, "info")) {
    //         return <ProfileInfoPage />;
    //     }
    //     if (isMatchUrlEndpoint(path, "reset-password")) {
    //         return <ProfileResetPasswordPage />;
    //     }
    // };

    // return (
    //     <>
    //         <MainHeader />
    //         <div className={styles.wrapper}>
    //             <Sidebar>
    //                 <SidebarContent
    //                     navigationLink={SidebarNavigationLinksData}
    //                 />
    //             </Sidebar>
    //             <div className={styles.content}>{createContent(pathname)}</div>
    //         </div>
    //     </>
    // );
};

export default ProfilePage;
