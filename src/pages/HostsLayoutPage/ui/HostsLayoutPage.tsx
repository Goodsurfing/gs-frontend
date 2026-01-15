import { Outlet } from "react-router-dom";

import { useCallback } from "react";

import { useTranslation } from "react-i18next";
import { useHostPagesSidebarData } from "@/shared/data/sidebar/host-pages";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import { PageLayout } from "@/widgets/PageLayout";

import { FillSidebarData } from "../lib/fillSidebarData";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./HostsLayoutPage.module.scss";

export const HostsLayoutPage = () => {
    const { data: myProfile, isLoading } = useGetProfileInfoQuery();
    const { HostPagesSidebarData } = useHostPagesSidebarData();
    const { t } = useTranslation();

    const hostSidebarContent = useCallback(() => {
        if (!isLoading && myProfile?.hostId) {
            return HostPagesSidebarData;
        }
        return FillSidebarData(HostPagesSidebarData, t);
    }, [isLoading, myProfile?.hostId, HostPagesSidebarData, t]);

    const sidebarContent = hostSidebarContent();

    return (
        <>
            {isLoading && (<MiniLoader />)}
            {!isLoading && myProfile && (
                <PageLayout sidebarContent={sidebarContent} wrapperClassName={styles.wrapper}>
                    <Outlet />
                </PageLayout>
            )}
        </>
    );
};
