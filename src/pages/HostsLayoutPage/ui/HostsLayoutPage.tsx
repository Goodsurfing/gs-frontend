import { Outlet } from "react-router-dom";

import { useCallback } from "react";

import { HostPagesSidebarData } from "@/shared/data/sidebar/host-pages";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useUser } from "@/entities/Profile";

import { PageLayout } from "@/widgets/PageLayout";

import { fillSidebarData } from "../lib/fillSidebarData";

export const HostsLayoutPage = () => {
    const { profile, isLoading } = useUser();

    const hostSidebarContent = useCallback(() => {
        if (!isLoading && profile?.organizations?.length) {
            return HostPagesSidebarData;
        }
        return fillSidebarData(HostPagesSidebarData);
    }, [profile, isLoading]);
    console.log(hostSidebarContent());
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
