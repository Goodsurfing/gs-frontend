import cn from "classnames";
import React, { FC, Suspense, useState } from "react";
import { useLocation } from "react-router-dom";

import MainHeader from "@/components/MainHeader/MainHeader";
import SideMenu from "@/components/SideMenu/SideMenu";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";

import { isMatchUrlEndpoint } from "@/utils/url/isMatchUrlEndpoint";
import HostDashboardPage from "../HostDashboardPage/HostDashboardPage";
// import HostDashboardPage = import("../HostDashboardPage/HostDashboardPage");
// import HostMainInfoPage =  import("../HostMainInfoPage/HostMainInfoPage");
import { HostPagesSidebarData } from "./HostPages.data";
import styles from "./HostPages.module.scss";
import HostMainInfoPage from "../HostMainInfoPage/HostMainInfoPage";

const HostPage: FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const { pathname } = useLocation();

    const createContent = (path: string) => {
        if (isMatchUrlEndpoint(path, "/dashboard")) {
            return <HostDashboardPage />;
        }
        if (isMatchUrlEndpoint(path, "/registration")) {
            return <HostMainInfoPage />;
        }
    };

    return (
        <div className={styles.layout}>
            <MainHeader />
            <SideMenu
                isOpen={isOpen}
                setOpen={setOpen}
                theme={Theme.LIGHT}
                content={HostPagesSidebarData}
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

export default HostPage;
