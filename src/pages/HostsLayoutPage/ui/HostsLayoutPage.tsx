import { Outlet } from "react-router-dom";

import { useCallback } from "react";

import { useTranslation } from "react-i18next";
import { useHostPagesSidebarData } from "@/shared/data/sidebar/host-pages";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useUser } from "@/entities/Profile";

import { PageLayout } from "@/widgets/PageLayout";

import { FillSidebarData } from "../lib/fillSidebarData";

export const HostsLayoutPage = () => {
    const { profile, isLoading } = useUser();
    const { HostPagesSidebarData } = useHostPagesSidebarData();
    const { t } = useTranslation();

    const hostSidebarContent = useCallback(() => {
        if (!isLoading && profile?.host) {
            return HostPagesSidebarData;
        }
        return FillSidebarData(HostPagesSidebarData, t);
    }, [isLoading, profile?.host, HostPagesSidebarData, t]);

    const sidebarContent = hostSidebarContent();

    return (
        <>
            {isLoading && (<Preloader />)}
            {!isLoading && profile && (
                <PageLayout sidebarContent={sidebarContent}>
                    <Outlet />
                </PageLayout>
            )}
        </>
    );
};
