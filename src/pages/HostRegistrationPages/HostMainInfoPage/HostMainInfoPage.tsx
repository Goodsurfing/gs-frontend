import React, { FC, useState } from "react";

import MainHeader from "@/components/MainHeader/MainHeader";
import SideMenu from "@/components/SideMenu/SideMenu";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";

import styles from "./HostMainInfoPage.module.scss";
import { HostRegistrationSidebarData } from "./HostMainInfoPages.data";
import HostMainInfoContent from "./HostMainInfoContent/HostMainInfoContent";

const HostMainInfoPage: FC = () => {
    return (
        <div className={styles.layout}>
            <MainHeader />
            <SideMenu
                theme={Theme.LIGHT}
                content={HostRegistrationSidebarData}
            />
            <div className={styles.wrapper}>
                <HostMainInfoContent />
            </div>
        </div>
    );
};

export default HostMainInfoPage;
