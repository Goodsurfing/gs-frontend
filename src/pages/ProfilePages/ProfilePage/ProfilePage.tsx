import cn from "classnames";
import React, { FC, useState } from "react";
import { useLocation } from "react-router-dom";

import SideMenu from "@/components/SideMenu/SideMenu";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";
import MainHeader from "@/components/ui/MainHeader/MainHeader";

import ProfileInfoPage from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoPage";
import { SideMenuData } from "@/pages/ProfilePages/ProfilePage/ProfilePage.data";
import ProfileResetPasswordPage from "@/pages/ProfilePages/ProfileResetPasswordPage/ProfileResetPasswordPage";

import { isMatchUrlEndpoint } from "@/utils/url/isMatchUrlEndpoint";

import styles from "./ProfilePage.module.scss";

const ProfilePage: FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
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
        <div className={styles.layout}>
            <MainHeader />
            <SideMenu
                setOpen={setOpen}
                isOpen={isOpen}
                theme={Theme.LIGHT}
                content={SideMenuData}
            />
            <div
                className={cn(styles.wrapper, {
                    [styles.opened]: isOpen,
                })}
            >
                {createContent(pathname)}
            </div>
        </div>
    );
};

export default ProfilePage;
