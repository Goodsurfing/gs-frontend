import cn from "classnames";
import React, { FC, useState } from "react";
import { useLocation } from "react-router-dom";

import SideMenu from "@/components/SideMenu/SideMenu";
import { Theme } from "@/components/SideMenu/types/SideMenu.interface";
import MainHeader from "@/components/ui/MainHeader/MainHeader";

import { isMatchUrlEndpoint } from "@/utils/url/isMatchUrlEndpoint";

import HostDashboardPage from "../HostDashboardPage/HostDashboardPage";
import HostMainInfoPage from "../HostMainInfoPage/HostMainInfoPage";
import { HostPagesSidebarData } from "./HostPages.data";
import styles from "./HostPages.module.scss";

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
