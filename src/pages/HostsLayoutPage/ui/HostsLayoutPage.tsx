import { Outlet } from "react-router-dom";

import { useCallback } from "react";

import { useHostPagesSidebarData } from "@/shared/data/sidebar/host-pages";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useUser } from "@/entities/Profile";

import { PageLayout } from "@/widgets/PageLayout";

import { FillSidebarData } from "../lib/fillSidebarData";

export const HostsLayoutPage = () => {
    const { profile, isLoading } = useUser();
    const { HostPagesSidebarData } = useHostPagesSidebarData();

    const hostSidebarContent = useCallback(() => {
        if (!isLoading && profile?.organizations?.length) {
            return HostPagesSidebarData;
        }
        return FillSidebarData(HostPagesSidebarData);
    }, [isLoading, profile?.organizations?.length, HostPagesSidebarData]);

    return (
        <>
            {isLoading && (<Preloader />)}
            {!isLoading && profile && (
                <PageLayout sidebarContent={hostSidebarContent()}>
                    <Outlet />
                </PageLayout>
            )}
        </>
    );
};
